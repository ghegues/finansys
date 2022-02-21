import {  Directive, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

@Directive()
export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources$:  Observable<T[]>;

  constructor(private resourceService: BaseResourceService<T>) { }

    ngOnInit(): void {
        this.resources$ = this.resourceService.getAll()
            .pipe(
                catchError(err => this.handleError(err, "Erro ao carregar lista"))
            );
    }

    protected handleError(error: any, erro: string): Observable<any>{
        alert("Erro na requisição => " + erro);
        return throwError(error);
      }

    deleteResource(resource: T){
        const mustDelete = confirm('Deseja realmente excluir este item?');
        // if(mustDelete)
        //     this.resourceService.delete(resource.id).subscribe(
        //         () => this.resources = this.resources.filter(element => element != resource),
        //         () => alert("Erro ao tentar excluir")
        //     )
    }
}
