import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError} from 'rxjs'
import { Injector } from '@angular/core'; 
import { BaseResourceModel } from '../models/base-resource.model';
import { catchError, map } from 'rxjs/operators';

export abstract class BaseResourceService<T extends BaseResourceModel> {


    protected http: HttpClient;

    constructor(
        protected apiPath: string, 
        protected injector: Injector, 
        protected jsonDataToResourceFn: (jsonData: any) => T) 
    { 
        this.http = injector.get(HttpClient);
    }

  
  getAll():Observable<T[]>{
    return this.http.get<T[]>(this.apiPath).pipe(
        map(this.jsonDataToResources.bind(this)),      
        catchError(this.handleError)
    );
  }

  getById(id: number): Observable<T> {
    const Url = `${this.apiPath}/${id}`;
    return this.http.get(Url).pipe(
      map(this.jsonDataToResource.bind(this)),      
      catchError(this.handleError)
    );
  }

  create(resource: T): Observable<T>{
    return this.http.post(this.apiPath, resource).pipe(
      map(this.jsonDataToResource.bind(this)),      
      catchError(this.handleError)
    );
  }

  update(resource: T): Observable<T>{
    const Url = `${this.apiPath}/${resource.id}`;
    return this.http.put(this.apiPath, resource).pipe(
      map(() => resource),
      catchError(this.handleError)
    );
  }

   delete(id: number): Observable<any> {
    const Url = `${this.apiPath}/${id}`;
    return this.http.delete(Url).pipe(     
      map(() => null),
      catchError(this.handleError)
    );
  }

   //PROTECTED METHODES
  protected jsonDataToResources(jsonData: any[]): T[]{
    const resources: T[] = [];
        jsonData.forEach(element => resources.push(this.jsonDataToResourceFn(element))
    );
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T{
    return this.jsonDataToResourceFn(jsonData)
  }

  protected handleError(error: any): Observable<any>{
    console.log("Erro na requisição => ", error);
    return throwError(error);
  }
 
}
