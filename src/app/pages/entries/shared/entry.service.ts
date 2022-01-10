import { Injectable, Injector } from '@angular/core'; 
import { Entry } from './entry.model';
import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {


  constructor(
    protected injector: Injector,
    private categoryService: CategoryService) { 

      super("api/entries", injector, Entry.fromJson)
    }


  create(entry: Entry): Observable<Entry>{
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  update(entry: Entry): Observable<Entry>{
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  }

  private setCategoryAndSendToServer(entry: Entry, sendFn: (func: Entry) => Observable<Entry>): Observable<Entry>{
    return this.categoryService.getById(entry.categoryId).pipe(
      mergeMap(category => {
        entry.category = category; 
        return sendFn(entry);
      }),
      catchError(this.handleError)
    )
  }

  //PRIVATE METHODES
  protected jsonDataToResources(jsonData: any[]): Entry[]{
    const entries: Entry[] = [];
    jsonData.forEach(element => entries.push(Entry.fromJson(element)));
    return entries;
  }

  protected jsonDataToResource(jsonData: any): Entry{
    return Entry.fromJson(jsonData);
  }
}
