import { Injectable, Injector } from '@angular/core'; 
import { Entry } from './entry.model';
import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import * as moment from 'moment';


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

  getByMonthAndYear(month: any, year: any): Observable<Entry[]> {
    return throwError("erro");
    // return this.getAll().pipe(
    //   map(entries => this.filterByMonthAndYear(entries, month, year))
    // )
  }

  private filterByMonthAndYear(entries: Entry[], month: any, year: any) {
    return entries.filter(
      entry => {
        const entryDate = moment(entry.date, "DD/MM/YYYY");
        const monthMatches = entryDate.month() + 1 == month;
        const yearMatches = entryDate.year() == year;

        if(monthMatches && yearMatches) 
          return entry;
        else {
          return null 
        }
      }
    )
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
