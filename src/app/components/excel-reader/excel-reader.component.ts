import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { BankStatement } from '../../interfaces/statement.interface';
import { BankDetails } from '../../interfaces/bankDetails.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-excel-reader',
  templateUrl: './excel-reader.component.html',
  styleUrls: ['./excel-reader.component.css'],
})
export class ExcelReaderComponent implements AfterViewInit {
  private paginator!: MatPaginator;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
  }

  data: any[] = [];
  accountDetails: BankDetails = {
    bankName: '',
    holderName: '',
    statementFrom: '',
    statementTo: '',
  };
  tableData: BankStatement[] = [];
  dataSource = new MatTableDataSource<BankStatement>(this.tableData);
  showData: boolean = false;

  columnsToDisplay: any[] = [
    'sNo',
    'title',
    'date',
    'depositAmount',
    'withdrawlAmount',
    'closingBalance',
  ];

  constructor() {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        /* Parse the Excel file */
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });

        /* Get the first sheet */
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        /* Convert sheet to JSON */
        this.data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        console.log('***Complete data : ', this.data); // Output the data for debugging
        this.parseStatement();
      };

      reader.readAsBinaryString(file);
    }
  }

  parseStatement() {
    if (this.data) {
      const cloneData = [...this.data];
      cloneData.splice(0, 22);

      const detail = this.data.find((record) => record[0]?.includes('MR ') || record[0]?.includes('MS') || record[0]?.includes('MRS'));

      this.accountDetails = {
        bankName: this.data[0],
        holderName: detail[0],
        statementFrom: this.data[2],
        statementTo: this.data[3],
      };


      let receivedEnd = false;
      cloneData.forEach((record, index) => {
        if (record && record[0]?.indexOf('*******') !== -1) {
          receivedEnd = true;
        }

        if (!receivedEnd && record[0]) {
          this.tableData.push({
            closingBalance: record[6],
            date: record[0],
            depositAmount: record[5] ? record[5] : null,
            sNo: index,
            title: record[1],
            withdrawlAmount: record[4] ? record[4] : null,
          });
        }
      });
      this.dataSource = new MatTableDataSource<BankStatement>(this.tableData);
      this.showData = true;
    }
  }
}
