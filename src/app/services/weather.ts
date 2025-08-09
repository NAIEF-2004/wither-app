
import { CurrentWeather } from './CurrentWeather';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GeoResult } from './GeoResult';

// تعريف واجهة لهيكل الاستجابة من API تحديد الموقع الجغرافي
interface GeocodeApiResponse {
  results?: Array<{
    longitude: any;
    id?: number;
    name: string;
    latitude: number;
    country?: string;
    country_code?: string;
    admin1?: string;
  }>;
}

//عطيتها root لكي تستطيع جميع الملفات الوصول للخدمة في حال
@Injectable({
  providedIn:'root'
})
export class WeatherService {
  // روابط API لتحديد الموقع الجغرافي والطقس
  private geocodeUrl = 'https://geocoding-api.open-meteo.com/v1/search';
  private forecastUrl = 'https://api.open-meteo.com/v1/forecast';

  // حقن HttpClient في الكونستركتر لاستخدامه في الطلبات
  constructor(private http: HttpClient) {}

  /**
   * دالة لتحديد إحداثيات مدينة معينة باستخدام API
   * @param city اسم المدينة
   * @returns Observable يحتوي على GeoResult أو null في حال الفشل
   */
  geocode(city: string): Observable<GeoResult | null> {
    const url = `${this.geocodeUrl}?name=${encodeURIComponent(city)}&count=1`;

    return this.http.get<GeocodeApiResponse>(url).pipe(
      map(res => {
        const first = res?.results?.[0]; // أخذ أول نتيجة من النتائج
        if (!first) return null;

        // تحويل البيانات إلى نموذج GeoResult
        return {
          name: first.name,
          latitude: first.latitude,
          longitude: first.longitude,
          country: first.country
        };
      }),
      catchError(err => {
        // طباعة الخطأ في حال حدوثه وإرجاع null
        console.error('Geocode error', err);
        return of(null);
      })
    );
  }

  /**
   * دالة للحصول على الطقس الحالي بناءً على الإحداثيات
   * @param latitude خط العرض
   * @param longitude خط الطول
   * @returns Observable يحتوي على CurrentWeather أو null في حال الفشل
   */
  getCurrentWeather(latitude: number, longitude: number): Observable<CurrentWeather | null> {
    const url = `${this.forecastUrl}?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    return this.http.get<any>(url).pipe(
      map(res => res?.current_weather ?? null), // استخراج الطقس الحالي من الاستجابة
      catchError(err => {
        //لطبع الخطا
        console.error('Forecast error', err);
        return of(null);
      })
    );
  }
}
