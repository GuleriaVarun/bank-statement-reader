import { Component, Input, OnInit } from '@angular/core';
import { BankStatement } from '../../interfaces/statement.interface';

export interface DataType {
  label: string;
  y: number;
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent implements OnInit {
  @Input() public data!: BankStatement[];
  totalSpent: number = 0;
  totalSaved: number = 0;
  remainingBalance: string = '';

  pieChartOptions = {
    animationEnabled: true,
    title: {
      text: 'Expenses',
    },
    theme: 'light2', // "light1", "dark1", "dark2"
    backgroundColor: 'transparent',
    data: [
      {
        type: 'pie',
        dataPoints: [],
      },
    ],
  };

  pieChartOptions2 = {
    animationEnabled: true,
    title: {
      text: 'Savings / Loans /Rents',
    },
    theme: 'light2', // "light1", "dark1", "dark2"
    backgroundColor: 'transparent',

    data: [
      {
        type: 'pie',
        dataPoints: [],
      },
    ],
  };

  ngOnInit(): void {
    console.log('**** Getting table data : ', this.data);
    this.getOverview();
  }

  getOverview() {
    let chartData: any[] = [];
    let chartDataSavings: any[] = [];

    if (this.data) {
      this.data.forEach((data) => {
        let category = '';
        let spent = data.withdrawlAmount as any;

        if (data.title.includes('SALARY')) {
          return;
        }

        if (
          data.title.includes('ZOMATO') ||
          data.title.includes('SWIGGY') ||
          data.title.includes('DOMINOS') ||
          data.title.includes('UBEREATS')
        ) {
          category = 'Food Ordered';
        } else if (
          data.title.includes('BD-BSE') ||
          data.title.includes('INDIANCLEARINGCORPOR') ||
          data.title.includes('KOTAK SAVING')
        ) {
          category = 'Savings';
        } else if (
          data.title.includes('OLACABS') ||
          data.title.includes('UBER')
        ) {
          category = 'Travel';
        } else if (
          data.title.includes('INSTAMART') ||
          data.title.includes('ZEPTO') ||
          data.title.includes('BIGBASKET') ||
          data.title.includes('SPAR')
        ) {
          category = 'Grocery';
        } else if (data.title.includes('CNRB0002518')) {
          category = 'Rent';
        } else if (
          data.title.includes('APOLLO') ||
          data.title.includes('PHARMA')
        ) {
          category = 'Medicines';
        } else if (data.title.includes('VARUN GULERIA-SBIN')) {
          category = 'Loan';
        } else if (data.title.includes('BOOKMYSHOW')) {
          category = 'Movies';
        } else if (
          data.title.includes('UPI-AIRTEL') ||
          data.title.includes('AIRTEL') ||
          data.title.includes('JIO')
        ) {
          category = 'Mobile Recharge';
        } else if (
          data.title.includes('PAY-AMAZONUPI') ||
          data.title.includes('AMAZON') ||
          data.title.includes('FLIPKART')
        ) {
          category = 'Amazon / Flipkart';
        } else {
          category = 'Misc';
        }

        if (
          category === 'Loan' ||
          category === 'Rent' ||
          category === 'Savings'
        ) {
          const categoryExist = chartDataSavings.some(
            (c) => c.label === category
          );
          if (categoryExist) {
            const index = chartDataSavings.findIndex(
              (c) => c.label === category
            );
            chartDataSavings[index].y += spent;
          } else {
            chartDataSavings.push({
              label: category,
              y: spent,
            });
          }
        } else {
          const categoryExist = chartData.some((c) => c.label === category);
          if (categoryExist) {
            const index = chartData.findIndex((c) => c.label === category);
            chartData[index].y += spent;
          } else {
            chartData.push({
              label: category,
              y: spent,
            });
          }
        }
      });

      this.pieChartOptions.data[0].dataPoints = chartData as any;
      this.totalSpent = chartData.reduce(function (acc, obj) {
        return acc + obj.y;
      }, 0);

      this.pieChartOptions2.data[0].dataPoints = chartDataSavings as any;
      this.totalSaved = chartDataSavings.reduce(function (acc, obj) {
        return acc + obj.y;
      }, 0);

      this.remainingBalance = this.data[this.data.length - 1].closingBalance;
    }
  }
}
