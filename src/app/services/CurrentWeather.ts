


//تعريف انتر فيس على طريقة الاستاذ محمد خاص ب الطقس الحالي
export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection?: number;
  time?: string;
  weathercode?: number;
  is_day?: number;
  interval?: number;
}
