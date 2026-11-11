import {
  Coordinates,
  CalculationMethod,
  Madhab,
  PrayerTimes,
} from "adhan";

export function get30DaySchedule(
  latitude: number,
  longitude: number,
  hanafi = false
) {
  const coordinates = new Coordinates(
    latitude,
    longitude
  );

  const params = CalculationMethod.UmmAlQura();

  params.madhab = hanafi
    ? Madhab.Hanafi
    : Madhab.Shafi;

  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date();

    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index);

    const prayer = new PrayerTimes(
      coordinates,
      date,
      params
    );

    const format = (value: Date) =>
      value.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

    const formatLocalDate = (value: Date) => {
      const year = value.getFullYear();

      const month = String(
        value.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        value.getDate()
      ).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    return {
      date: formatLocalDate(date),

      weekday: date.toLocaleDateString("en-US", {
        weekday: "long",
      }),

      month: date.toLocaleDateString("en-US", {
        month: "long",
      }),

      fajr: format(prayer.fajr),
      dhuhr: format(prayer.dhuhr),
      asr: format(prayer.asr),
      maghrib: format(prayer.maghrib),
      isha: format(prayer.isha),
      sunrise: format(prayer.sunrise),
    };
  });
}