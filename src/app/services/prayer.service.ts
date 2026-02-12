import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { switchMap, map, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrayerService {

  constructor(private http: HttpClient) {}

  getPrayerTimes(city: string) {

    const geoParams = new HttpParams()
      .set('name', city)       
      .set('count', '1')
      .set('language', 'ar'); 
      
    return this.http
      .get<any>('https://geocoding-api.open-meteo.com/v1/search', { params: geoParams })
      .pipe(
        switchMap(geo => {

          console.log('GEO RESPONSE:', geo);

          if (!geo.results || geo.results.length === 0) {
            return throwError(() => new Error('CITY_NOT_FOUND'));
          }

          const { latitude, longitude, name, country } = geo.results[0];

          const today = new Date().toISOString().split('T')[0];

          const prayerParams = new HttpParams()
            .set('latitude', latitude.toString())
            .set('longitude', longitude.toString());

          return this.http
            .get<any>(`https://api.aladhan.com/v1/timings/${today}`, { params: prayerParams })
            .pipe(
              map(res => {
                const t = res.data.timings;

                return {
                  city: name,       
                  country,          
                  timings: {
                    Fajr: t.Fajr.split(' ')[0],
                    Dhuhr: t.Dhuhr.split(' ')[0],
                    Asr: t.Asr.split(' ')[0],
                    Maghrib: t.Maghrib.split(' ')[0],
                    Isha: t.Isha.split(' ')[0]
                  }
                };
              })
            );
        })
      );
  }
}
