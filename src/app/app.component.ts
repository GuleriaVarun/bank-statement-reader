import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'statement-reader';
  onboardingComplete: boolean = false;
  
  addItem(ev: any) {
    console.log('*************** Got event : ', ev);
    this.onboardingComplete = ev;
  }
}
