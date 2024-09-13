import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AsyncPipe } from '@angular/common';


export const appConfig: ApplicationConfig = { 
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),  {
    provide: AsyncPipe,
    useClass: AsyncPipe
  }]
};