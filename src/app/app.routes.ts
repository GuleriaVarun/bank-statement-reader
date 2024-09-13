import { Routes } from '@angular/router';
import { ExcelReaderComponent } from './components/excel-reader/excel-reader.component';

export const routes: Routes = [{
    path: '/', pathMatch: 'full', component: ExcelReaderComponent
}];
