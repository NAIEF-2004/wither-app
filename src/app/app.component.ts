import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherComponent } from './components/weather/weather';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, WeatherComponent],
  template: `
    <app-weather></app-weather>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
    }
  `]
})
export class AppComponent {
  title = 'weather-app';
} 