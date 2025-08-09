
import { TestBed } from '@angular/core/testing';
import { WeatherService } from './weather';

// بداية مجموعة اختبارات لخدمة WeatherService
describe('WeatherService', () => {
  // تعريف متغير للاحتفاظ بنسخة من الخدمة
  let service: WeatherService;
  beforeEach(() => {
    TestBed.configureTestingModule({

      imports: [],
      // تسجيل WeatherService كمزود للخدمة
      providers: [WeatherService]
    });


    service = TestBed.inject(WeatherService);
  });

  // اختبار بسيط للتحقق من أن الخدمة تم إنشاؤها بنجاح
  it('should be created', () => {

    expect(service).toBeTruthy();
  });
});
