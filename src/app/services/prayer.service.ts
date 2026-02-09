
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { switchMap, map, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrayerService {

  constructor(private http: HttpClient) {}

  getPrayerTimes(city: string) {

    // 🔹 Geocoding (يدعم العربية)
    const geoParams = new HttpParams()
      .set('name', city)
      .set('count', '1')
      .set('language', 'ar');

    return this.http
      .get<any>('https://geocoding-api.open-meteo.com/v1/search', { params: geoParams })
      .pipe(
        switchMap(geo => {
          if (!geo.results || geo.results.length === 0) {
            return throwError(() => new Error('CITY_NOT_FOUND'));
          }

          const { latitude, longitude, name, country } = geo.results[0];

          // 🔹 Prayer API
          const prayerParams = new HttpParams()
            .set('latitude', latitude)
            .set('longitude', longitude)
            .set('method', '2');

          return this.http
            .get<any>('https://api.aladhan.com/v1/timings', { params: prayerParams })
            .pipe(
              map(res => ({
                city: name,
                country,
                latitude,
                longitude,
                timings: res.data.timings
              }))
            );
        })
      );
  }
}