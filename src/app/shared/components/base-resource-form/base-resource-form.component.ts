import {  OnInit, AfterContentChecked, Component, Injector, Injectable, Directive } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import * as toastr from 'toastr';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';


@Directive()
export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string = ""; 
  pageTitle: string = "";
  serverErrorMessages: string[] = [];
  submittingForm: boolean = false;
  resourceForm: FormGroup;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuider: FormBuilder;

  constructor(   
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData: any) => T
    ) { 
        this.route = this.injector.get(ActivatedRoute);
        this.router = this.injector.get(Router);
        this.formBuider = this.injector.get(FormBuilder);
    }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }  
      
  ngAfterContentChecked(): void { 
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;
    if(this.currentAction == "new")
      this.createResource();
    else
      this.updateResource();
  }

  protected setPageTitle() {
    if (this.currentAction == "new")
      this.pageTitle = this.creationPageTitle();
    else{     
      this.pageTitle = this.editionPageTitle()
    }
  }

  protected creationPageTitle(): string{
    return "Novo";
  }
  protected editionPageTitle(): string {
      return "Edição";
  }

  private createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    
    this.resourceService.create(resource)
      .subscribe(
        resource => this.actionsForSuccess(resource),
        error => this.actionForError(error)
      )
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    
    this.resourceService.update(resource)
      .pipe(
        tap(resource => this.actionsForSuccess(resource)),
        catchError(this.actionForError)
      ).subscribe()
  }
  
  //redirect/reload component page
  protected actionsForSuccess(resource: T) {
    toastr.success("Solicitação processada com sucesso!");

    const baseComponentUrl = this.route.snapshot.parent.url[0].path;

    this.router.navigateByUrl(baseComponentUrl, {skipLocationChange: true}).then(
      () => this.router.navigate([baseComponentUrl,resource.id, "edit"])
    );
  }

  protected actionForError(error: any):Observable<any>{
    toastr.error("Ocorreu um erro ao processar sua solicitação!");

    this.submittingForm = false;
    
    if(error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."]
    return throwError(error);
  }

  protected loadResource() {
    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(+params.get("id")))
      ).subscribe(
        (resource) => {
          this.resource = resource;
          this.resourceForm.patchValue(resource); //binds loaded resource data to resourceForm
        },
        (error) => alert("Ocorreu um erro no servidor, tente novamente")
      );
    }
  }
 

  protected setCurrentAction() {
    this.currentAction = this.route.snapshot.url[0].path == "new" ? "new" : "edit";
  }

  protected abstract buildResourceForm(): void;
    
}
