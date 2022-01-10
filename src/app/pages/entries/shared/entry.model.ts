import { BaseResourceModel } from "src/app/shared/models/base-resource.model";
import { Category } from "../../categories/shared/category.model";

export class Entry extends BaseResourceModel {
    public id:number = 0;
    public name?: string;
    public description?: string;
    public type?: string;
    public amount?: string;
    public date?: string;
    public paid?: boolean;
    public categoryId?: number;
    public category?: Category;
    constructor(
       
    ){
        super();
    }

   
    static types = {
        expense: 'Despesa',
        renevue: 'Receita'
    }; 

    static fromJson(jsonData: any): Entry {
        return Object.assign(new Entry(), jsonData);
    }
    
    get paidText(): string {
        return this.paid ? 'Pago' : 'Pendente'
    }
}