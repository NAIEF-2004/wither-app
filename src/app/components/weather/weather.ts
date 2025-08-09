
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// استيراد خدمة الطقس والواجهات المطلوبة
import { WeatherService} from '../../services/weather';
// استيراد forkJoin و of من RxJS للتعامل مع البيانات التفاعلية
import { forkJoin, of } from 'rxjs';
// استيراد switchMap و finalize من RxJS للتعامل مع البيانات
import { switchMap, finalize } from 'rxjs/operators';
import { GeoResult } from '../../services/GeoResult';
import { CurrentWeather } from '../../services/CurrentWeather';

// تعريف مكون الطقس
@Component({

  selector: 'app-weather',
  // تحديد أن هذا مكون مستقل
  standalone: true,
  // قائمة الوحدات المستوردة
  imports: [CommonModule, ReactiveFormsModule],
  // مزودي الخدمات
  providers: [WeatherService],

  templateUrl: './weather.html',

  styleUrls: ['./weather.scss']
})
export class WeatherComponent {
  // عنصر التحكم في حقل إدخال المدينة
  city = new FormControl('');
  // متغير لتتبع حالة التحميل
  loading = false;
  // متغير لتخزين رسائل الخطأ
  error: string | null = null;

  // كائن لتخزين نتائج البحث
  result: {
    city?: string;
    temperature?: number;
    windspeed?: number;
    winddirection?: number;
    time?: string;

  } | null = null;

  // إنشاء مثيل للمكون مع حقن خدمة الطقس
  constructor(private weatherService: WeatherService) { }

  // دالة البحث عن الطقس
  search() {
    const cityName = (this.city.value || '').trim();
    // التحقق من إدخال اسم المدينة
    if (!cityName) {
      this.error = 'أدخل اسم المدينة';
      this.result = null;
      return;
    }

    // إعادة تعيين المتغيرات
    this.error = null;
    this.result = null;
    this.loading = true;

    // هنا نستخدم RxJS: أولًا نأخذ Geocoding ثم نستخدم forkJoin لدمج (geo, weather)
    this.weatherService.geocode(cityName).pipe(
      switchMap(geo => {
        if (!geo) {
          this.error = 'لم يتم إيجاد المدينة';
          return of(null);
        }
        return forkJoin({
          geo: of(geo),
          weather: this.weatherService.getCurrentWeather(geo.latitude, geo.longitude)
        });
      }),
      finalize(() => this.loading = false)
    ).subscribe((res: any) => {
      if (!res) return;
      const { geo, weather } = res as { geo: GeoResult; weather: CurrentWeather | null };
      if (!weather) {
        this.error = 'تعذر الحصول على بيانات الطقس';
        return;
      }
      this.result = {
        city: geo.name,
        temperature: weather.temperature,
        windspeed: weather.windspeed,
        winddirection: weather.winddirection,
        time: weather.time
      };
    }, (err: any) => {
      console.error(err);
      this.error = 'حدث خطأ أثناء الاتصال';
      this.loading = false;
    });
  }
}
