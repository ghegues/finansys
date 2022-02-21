import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { CalendarModule } from "primeng/calendar";
import { IMaskModule } from 'angular-imask';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})

export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {

  categories$: Observable<Category[]>;

  imaskConfig = {
    mask: Number,
    scale: 2, 
    thounsandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  }


  constructor(
    protected entryService: EntryService, 
    protected categoryService: CategoryService,
    protected injector: Injector
   ) {
     super(injector, new Entry(), entryService, Entry.fromJson);
    }

  ngOnInit(): void {   
    super.ngOnInit();
    this.loadCategories();
  }  


  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }
  
  private loadCategories() {
    this.categories$ = this.categoryService.getAll();
  }
 
  protected buildResourceForm() {
    this.resourceForm = this.formBuider.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ["expense", Validators.required],
      amount:  [null, Validators.required],
      date:  [null, Validators.required],
      paid:  [true, Validators.required],
      categoryId:  [null, Validators.required]
    })
  }

  protected creationPageTitle(): string {
    return "Cadastro de novo lançamento";
  }
  protected editionPageTitle(): string {
    const entry = this.resource.name || "";
    return "Editando lançamento: "+ entry;
  }

}
