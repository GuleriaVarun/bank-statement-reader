// onboarding.component.ts
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent {
  @Output() newItemEvent = new EventEmitter<boolean>();
  
  slides = [
    {
      title: 'Track Your Expenses',
      description: 'Easily keep track of your spending and manage your budget.',
      svg: 'feature1.svg'
    },
    {
      title: 'Set Budgets',
      description: 'Create and manage budgets for different categories.',
      svg: 'feature2.svg'
    },
    {
      title: 'View bank statement',
      description: 'Analyze your spending patterns with detailed reports.',
      svg: 'feature3.svg'
    }
  ];

  currentSlideIndex = 0;

  nextSlide() {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.currentSlideIndex++;
    }

    if (this.currentSlideIndex == 2) {
      setTimeout(() => {
        this.newItemEvent.emit(true);
      }, 2000)
    }
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    }
  }
}
