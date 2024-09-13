import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExcelReaderComponent } from './components/excel-reader/excel-reader.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { OverviewComponent } from './components/overview/overview.component';
import * as CanvasJSAngularChart from '../assets/canvasjs.angular.component';
import { NavbarComponent } from './components/navbar/navbar.component';
var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    ExcelReaderComponent,
    OverviewComponent,
    CanvasJSChart,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
