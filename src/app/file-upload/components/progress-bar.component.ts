import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  template: `
    <div class="progress-container">
      <div class="progress-bar" [style.width.%]="progress">
        <span class="progress-text">{{progress}}%</span>
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      width: 100%;
      height: 20px;
      background-color: #f0f0f0;
      border-radius: 10px;
      overflow: hidden;
      margin: 10px 0;
    }
    .progress-bar {
      height: 100%;
      background-color: #4CAF50;
      transition: width 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .progress-text {
      color: white;
      font-size: 12px;
      font-weight: bold;
    }
  `]
})
export class ProgressBarComponent {
  @Input() progress: number = 0;
}