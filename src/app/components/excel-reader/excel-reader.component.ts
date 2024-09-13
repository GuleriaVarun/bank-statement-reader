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
  public banks: any[] = [
    { value: 'uco', viewValue: 'UCO' },
    { value: 'kotak', viewValue: 'KOTAK' },
    { value: 'hdfc', viewValue: 'HDFC' },
    { viewValue: 'ICICI', value: 'icici' },
    { viewValue: 'SBI', value: 'sbi' },
  ];
  public selectedBank: string = '';

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
        let sheetIndex = 0;
        if (this.selectedBank === 'kotak') {
          sheetIndex = 3;
        }
        /* Get the first sheet */
        const sheetName = workbook.SheetNames[sheetIndex];
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

      if (this.selectedBank === 'hdfc') {
        this.parseHdfcStatement(cloneData);
      } else if (this.selectedBank === 'kotak') {
        this.parseKotakStatement(cloneData);
      } else if (this.selectedBank === 'sbi') {
        this.parseSBIStatement(cloneData);
      }

      this.dataSource = new MatTableDataSource<BankStatement>(this.tableData);
      this.showData = true;
    }
  }

  /**
   * Parse HDFC Statement
   * @param cloneData 
   */
  private parseHdfcStatement(cloneData: any[]) {
    cloneData.splice(0, 22);

    const detail = this.data.find(
      (record) =>
        record[0]?.includes('MR ') ||
        record[0]?.includes('MS') ||
        record[0]?.includes('MRS')
    );

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

  }

  /**
   * Parse Kotak Statement
   * @param cloneData 
   */
  parseKotakStatement(cloneData: any[]) {
    cloneData.splice(0, 1);

    let receivedEnd = false;
    cloneData.forEach((record, index) => {
      if (record[0]) {
        const withdrawlAmount = record[3].indexOf("(Dr)") !== -1 ? record[3].split('(Dr)')[0] : '';
        const depositAmount = record[3].indexOf("(Cr)") !== -1 ? record[3].split('(Cr)')[0] : '';

        this.tableData.push({
          closingBalance: record[4].split('(Cr)')[0],
          date: record[0],
          depositAmount,
          sNo: index,
          title: record[1],
          withdrawlAmount
        });
      }
    });
    receivedEnd = true;
  }

  parseSBIStatement(cloneData: any[]) {
    cloneData.splice(0, 14);

    let receivedEnd = false;
    cloneData.forEach((record, index) => {
      if (record[0] && record[1]) {
        this.tableData.push({
          closingBalance: record[7],
          date: record[0],
          depositAmount: record[6],
          sNo: index,
          title: record[1],
          withdrawlAmount: record[5]
        });
      }
    });
    receivedEnd = true;
  }
}
