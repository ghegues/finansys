import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';

const routes: Routes = [
  {path:'', component:CategoryListComponent},
  {path:':id/edit', component:CategoryFormComponent},
  {path:'new', component:CategoryFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
