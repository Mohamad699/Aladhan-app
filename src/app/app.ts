
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrayerService } from './services/prayer.service';
import { ChangeDetectorRef } from '@angular/core';
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
constructor(
  private prayerService: PrayerService,
  private cdr: ChangeDetectorRef
) {}
search() {
  const city = this.city.trim();
  if (!city) return;

  this.loading = true;
  this.error = '';
  this.data = null;

  this.prayerService.getPrayerTimes(city).subscribe({
    next: res => {
      console.log('Prayer Times Response:', res);
      console.log('قبل', this.loading);
      this.data = res;
      this.loading = false; // ✅ سيُحدّث الواجهة فورًا
       this.cdr.detectChanges();
      console.log('بعد', this.loading);
    },
    error: () => {
      this.error = 'لم يتم العثور على المدينة';
      this.loading = false;
       this.cdr.detectChanges();
    }
  });
}


}