import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrayerService } from './services/prayer.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html'
})
export class App {
  city = '';
  data: any = null;
  loading = false;
  error = '';

  constructor(private prayerService: PrayerService) {
   
    const savedCity = localStorage.getItem('city');
    if (savedCity) {
      this.city = savedCity;
    }
  }
search() {
  const city = this.city.trim();
  if (!city) return;

  this.loading = true;
  this.error = '';

  this.prayerService.getPrayerTimes(city).subscribe({
    next: res => {
      this.data = res;
      localStorage.setItem('prayerData', JSON.stringify(res));
      localStorage.setItem('city', city);
      this.loading = false;
    },
    error: () => {
      this.error = 'لم يتم العثور على المدينة';
      this.loading = false;
    }
  });
}
}


