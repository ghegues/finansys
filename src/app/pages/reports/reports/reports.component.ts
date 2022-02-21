import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CategoryService } from '../../categories/shared/category.service';
import  * as currencyFormater from "currency-formatter";
import { Category } from '../../categories/shared/category.model';
import { Entry } from '../../entries/shared/entry.model';
import { EntryService } from '../../entries/shared/entry.service';
import { chartModel } from 'src/app/shared/models/chart-model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})




export class ReportsComponent implements OnInit {

  expenseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;

  expenseChartData: any;
  revenueChartData: any;

  chartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };

  categories: Category[] = [];
  entries: Entry[] = [];

  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;

  constructor(
    private categoryService: CategoryService, 
    private entryService: EntryService) { }

  ngOnInit(): void {
  //  this.categoryService.getAll().subscribe(
  //    categories => this.categories = categories
  //  );
  }

  generateReports() {
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if(!month || !year)
      alert("Você precisa selecionar o mês e o ano para gerar relatórios")
    else{
      this.entryService.getByMonthAndYear(month, year).subscribe(
        this.setValues.bind(this)
      );
    }
  }

  private setValues(entries: Entry[]){
    this.entries = entries;
    this.calculateBalance();
    this.setCharsetData();
  }

  private calculateBalance(){
    let expenseTotal = 0;
    let revenueTotal = 0;

    this.entries.forEach( entry => {
      if(entry.type == "revenue")
        revenueTotal += currencyFormater.unformat(entry.amount, {code: 'BRL'});
      else{
        expenseTotal += currencyFormater.unformat(entry.amount, {code: 'BRL'});
      }
    })

    this.expenseTotal = currencyFormater.format(expenseTotal, {code: 'BRL'});
    this.revenueTotal = currencyFormater.format(revenueTotal, {code: 'BRL'});
    this.balance = currencyFormater.format(revenueTotal - expenseTotal, {code: 'BRL'});
  }

  private setCharsetData(){
    this.revenueChartData = this.getChartData('revenue', 'Gráfico de receitas', '#9CCC65')
    this.expenseChartData = this.getChartData('expense', 'Gráfico de despesas', '#e03131')
  }

  private getChartData(entryType: string, title: string, color: string){
    const chartData: chartModel[] = [];
    this.categories.forEach( 
      category => {
        const filteredEntries = this.entries.filter(
          entry => (entry.categoryId == category.id && entry.type == entryType) 
        );

        //if found entries, then sum entries amount and add to chardData
        if(filteredEntries.length > 0){
          const totalAmount = filteredEntries.reduce(
            (total, entry) => total + currencyFormater.unformat(entry.amount, {code: 'BRL'}), 0
          );

          chartData.push({
            categoryName: category.name,
            totalAmount: totalAmount
          })
        }
    });

    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [
        {
          label: entryType,
          backgroundColor: color,
          data: chartData.map(item => item.totalAmount)
        }
      ]
    }
  }
}
