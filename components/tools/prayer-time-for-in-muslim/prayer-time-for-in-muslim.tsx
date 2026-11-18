"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Coordinates,
  CalculationMethod,
  Madhab,
  PrayerTimes,
} from "adhan";

import { get30DaySchedule } from "./30-day-schedule";
import { prayerTimeSeo } from "./seo";
import "./prayer-time-for-in-muslim.css";

type LocationData = {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
};

type PrayerItem = {
  name: string;
  time: Date;
};

// Default location: Makkah, Saudi Arabia
const DEFAULT_LOCATION: LocationData = {
  latitude: 21.42664,
  longitude: 39.82563,
  city: "Makkah",
  country: "Saudi Arabia",
};

// Format Full Hijri Date for the 30-day schedule
const formatScheduleHijriDate = (dateString: string) => {
  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  const date = new Date(year, month - 1, day, 12);

  const hijriParts = new Intl.DateTimeFormat(
    "en-US-u-ca-islamic-umalqura",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).formatToParts(date);

  const hijriDay = hijriParts.find(
    (part) => part.type === "day"
  )?.value;

  const hijriMonth = hijriParts.find(
    (part) => part.type === "month"
  )?.value;

  const hijriYear = hijriParts.find(
    (part) => part.type === "year"
  )?.value;

  return `${hijriDay} ${hijriMonth} ${hijriYear} AH`;
};

export default function PrayerTimeForInMuslim() {
  const [location, setLocation] =
    useState<LocationData>(DEFAULT_LOCATION);

  const [prayers, setPrayers] = useState<PrayerItem[]>([]);
  const [sunrise, setSunrise] = useState<Date | null>(null);

  const [schedule, setSchedule] = useState<
    ReturnType<typeof get30DaySchedule>
  >([]);

  const [nextPrayer, setNextPrayer] =
    useState<PrayerItem | null>(null);

  const [nextDayPrayers, setNextDayPrayers] =
    useState<PrayerItem[]>([]);

  const [countdown, setCountdown] = useState("");
  const [now, setNow] = useState(new Date());
  const [hanafi, setHanafi] = useState(false);

  // Do not show a location-detection message on initial page load.
  const [detectingLocation, setDetectingLocation] =
    useState(false);

  const [locationMessage, setLocationMessage] = useState(
    "Showing default prayer times for Makkah, Saudi Arabia."
  );

  const [locationType, setLocationType] = useState<
    "default" | "current"
  >("default");

  // Detect user's actual location
  const getLocation = useCallback((showStatus = true) => {
    if (!navigator.geolocation) {
      setDetectingLocation(false);
      setLocation(DEFAULT_LOCATION);
      setLocationType("default");

      setLocationMessage(
        "Location is not supported by your browser. Showing prayer times for Makkah, Saudi Arabia."
      );

      return;
    }

    // Only show the loading state when the user manually refreshes.
    if (showStatus) {
      setDetectingLocation(true);
      setLocationMessage("Updating your current location...");
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Update prayer calculations immediately using GPS coordinates.
        // Do not wait for reverse geocoding.
        setLocation({
          latitude,
          longitude,
          city: "Your Location",
          country: "",
        });

        setLocationType("current");
        setDetectingLocation(false);

        setLocationMessage(
          "Prayer times are calculated for your current location."
        );

        // Find the city and country name separately.
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=12&accept-language=en`
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Unable to find location name");
            }

            return response.json();
          })
          .then((data) => {
  const address = data.address || {};

  const city =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.city_district ||
    address.suburb ||
    address.locality ||
    address.county ||
    address.state_district ||
    address.hamlet ||
    address.neighbourhood ||
    address.state ||
    data.name ||
    "Your Location";

  const country = address.country || "";

  setLocation({
    latitude,
    longitude,
    city,
    country,
  });
          })
          .catch(() => {
            // Prayer calculations continue using GPS coordinates.
          });
      },

      () => {
        // If location access is denied or unavailable,
        // use Makkah as the default location.
        setLocation(DEFAULT_LOCATION);
        setLocationType("default");
        setDetectingLocation(false);

        setLocationMessage(
          "Location access is unavailable. Showing default prayer times for Makkah, Saudi Arabia."
        );
      },

      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  }, []);

  // Automatically detect location when the page opens.
  // No visible loading message is shown during initial detection.
  useEffect(() => {
    getLocation(false);
  }, [getLocation]);

  // Update browser title based on the current location.
  useEffect(() => {
    document.title = `Prayer Time for Muslim | Namaz Time in ${location.city}`;
  }, [location.city]);

  // Generate 30-day prayer schedule.
  useEffect(() => {
    setSchedule(
      get30DaySchedule(
        location.latitude,
        location.longitude,
        hanafi
      )
    );
  }, [location, hanafi]);

  // Calculate daily prayer times and countdown.
  useEffect(() => {
    const update = () => {
      const current = new Date();

      setNow(current);

      const coordinates = new Coordinates(
        location.latitude,
        location.longitude
      );

      const params = CalculationMethod.UmmAlQura();

      params.madhab = hanafi
        ? Madhab.Hanafi
        : Madhab.Shafi;

      const todayTimes = new PrayerTimes(
        coordinates,
        current,
        params
      );

      const tomorrow = new Date(current);

      tomorrow.setDate(tomorrow.getDate() + 1);

      const tomorrowTimes = new PrayerTimes(
        coordinates,
        tomorrow,
        params
      );

      const allPrayers: PrayerItem[] = [
        { name: "Fajr", time: todayTimes.fajr },
        { name: "Dhuhr", time: todayTimes.dhuhr },
        { name: "Asr", time: todayTimes.asr },
        { name: "Maghrib", time: todayTimes.maghrib },
        { name: "Isha", time: todayTimes.isha },
      ];

      const tomorrowPrayers: PrayerItem[] = [
        { name: "Fajr", time: tomorrowTimes.fajr },
        { name: "Dhuhr", time: tomorrowTimes.dhuhr },
        { name: "Asr", time: tomorrowTimes.asr },
        { name: "Maghrib", time: tomorrowTimes.maghrib },
        { name: "Isha", time: tomorrowTimes.isha },
      ];

      setPrayers(allPrayers);
      setSunrise(todayTimes.sunrise);
      setNextDayPrayers(tomorrowPrayers);

      // Wait one hour after Isha before showing next Fajr.
      const ishaGraceEnd = new Date(
        todayTimes.isha.getTime() + 60 * 60 * 1000
      );

      let next: PrayerItem | null = null;

      if (current.getTime() < todayTimes.isha.getTime()) {
        next =
          allPrayers.find(
            (item) =>
              item.time.getTime() > current.getTime()
          ) || null;
      } else if (
        current.getTime() >= ishaGraceEnd.getTime()
      ) {
        next = tomorrowPrayers[0];
      }

      setNextPrayer(next);

      if (!next) {
        setCountdown("");
        return;
      }

      const difference =
        next.time.getTime() - current.getTime();

      const hours = Math.floor(
        difference / 3600000
      );

      const minutes = Math.floor(
        (difference % 3600000) / 60000
      );

      const seconds = Math.floor(
        (difference % 60000) / 1000
      );

      const countdownParts: string[] = [];

      if (hours > 0) {
        countdownParts.push(
          `${hours} ${hours === 1 ? "Hour" : "Hours"}`
        );
      }

      if (minutes > 0) {
        countdownParts.push(
          `${minutes} ${
            minutes === 1 ? "Minute" : "Minutes"
          }`
        );
      }

      if (seconds > 0) {
        countdownParts.push(
          `${seconds} ${
            seconds === 1 ? "Second" : "Seconds"
          }`
        );
      }

      setCountdown(
        countdownParts.length > 0
          ? countdownParts.join(" ")
          : "Less than a Second"
      );
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [location, hanafi]);

  // Format time.
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  // Format date.
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatUpcomingDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const hijriDate = new Intl.DateTimeFormat(
    "en-US-u-ca-islamic-umalqura",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(now);

  return (
    <main className="prayer-time1">
      {/* Main Heading */}
      <header className="prayer-time2">
        <h1>
          Prayer Time for Muslim | Namaz Time in {location.city}
        </h1>

        <p>
          Accurate Muslim prayer times for your current location.
          Check today's Namaz time, upcoming prayers and the
          complete 30-day prayer schedule.
        </p>

        {/* Current Location */}
        <div className="prayer-time-location">
          📍 {location.city}
          {location.country ? `, ${location.country}` : ""}
        </div>

        {/* Tool Image - Lazy Loaded */}
{locationType === "default" && (
  <div
    style={{
      width: "100%",
      maxWidth: "1200px",
      margin: "30px auto",
      textAlign: "center"
    }}
  >
    <img
      src="/images/prayer-time-location.webp"
      alt="Muslim Prayer Times and Location Guide"
      width="1200"
      height="675"
      loading="lazy"
      decoding="async"
      style={{
        display: "block",
        width: "100%",
        height: "auto",
        borderRadius: "10px"
      }}
    />
  </div>
)}

       {/* Location Information */}
<div
  className="prayer-time-location-status"
  aria-live="polite"
>
  {locationType === "default" && !detectingLocation && (
    <p className="prayer-time-location-alert">
      Location access is unavailable. Turn on the location
      of your device and see the exact prayer schedule.
    </p>
  )}

  {locationType === "current" && (
    <p>{locationMessage}</p>
  )}

{locationType === "default" && (
  <button
    className="prayer-time-button"
    onClick={() => getLocation(true)}
    disabled={detectingLocation}
  >
    {detectingLocation
      ? "Updating Location..."
      : "Use My Current Location"}
  </button>
)}
</div>
      </header>

      {/* Prayer Calculation Method */}
      <section className="prayer-time-method">
        <h2>Prayer Calculation Method</h2>

        <label>
          <input
            type="checkbox"
            checked={hanafi}
            onChange={(e) =>
              setHanafi(e.target.checked)
            }
          />

          Hanafi Asr Calculation
        </label>

        <p>
          Checked: Hanafi Asr Calculation.
          Unchecked: Shafi / Standard Asr Calculation.
        </p>
      </section>

      {/* Next Prayer */}
      {nextPrayer && (
        <section className="prayer-time4">
          <h2>Next Prayer</h2>

          <div className="prayer-time-next-name">
            {nextPrayer.name}
          </div>

          <div className="prayer-time5">
            {formatTime(nextPrayer.time)}
          </div>

          <p>Time Remaining</p>

          <div className="prayer-time6">
            {countdown}
          </div>

          <p className="prayer-time-next-date">
            {formatUpcomingDate(nextPrayer.time)}
          </p>
        </section>
      )}

      {/* Today's Prayer Times */}
      <section className="prayer-time7">
        <div className="prayer-time8">
          <div>
            <h2>Today's Prayer Times</h2>

            <p>{formatDate(now)}</p>

            <p className="prayer-time-hijri">
              {hijriDate}
            </p>
          </div>
          
        </div>

        <div className="prayer-time-grid">
          {prayers.map((prayer) => {
            const passed =
              prayer.time.getTime() < now.getTime();

            const isNext =
              nextPrayer?.time.getTime() ===
              prayer.time.getTime();

            const difference =
              now.getTime() - prayer.time.getTime();

            const minutes = Math.floor(
              difference / 60000
            );

            const passedMoreThan30Minutes =
              passed && minutes > 30;

            const tomorrowPrayer =
              nextDayPrayers.find(
                (item) => item.name === prayer.name
              );

            return (
              <article
                key={prayer.name}
                className={`prayer-time-card ${
                  isNext ? "prayer-time-active" : ""
                }`}
              >
                <div className="prayer-time-card-name">
                  {prayer.name}
                </div>

                <div className="prayer-time-card-time">
                  {formatTime(prayer.time)}
                </div>

                {isNext ? (
                  <p>Next Prayer</p>
                ) : passedMoreThan30Minutes &&
                  tomorrowPrayer ? (
                  <div className="prayer-time-upcoming">
                    <span>Upcoming Prayer</span>

                    <strong>{prayer.name}</strong>

                    <span>
                      {formatTime(tomorrowPrayer.time)}
                    </span>

                    <small>
                      {formatUpcomingDate(
                        tomorrowPrayer.time
                      )}
                    </small>
                  </div>
                ) : passed ? (
                  <p>{minutes} minutes ago</p>
                ) : (
                  <p>Upcoming Prayer</p>
                )}
              </article>
            );
          })}

          {/* Sunrise */}
          {sunrise && (
            <article className="prayer-time-card prayer-time-sunrise">
              <div className="prayer-time-card-name">
                Sunrise
              </div>

              <div className="prayer-time-card-time">
                {formatTime(sunrise)}
              </div>

              <p>Sunrise Time</p>
            </article>
          )}
        </div>
      </section>

      {/* 30 Day Schedule */}
      <section className="prayer-time9">
        <h2>
          30 Day Prayer Time Schedule for{" "}
          {location.city}
          {location.country
            ? `, ${location.country}`
            : ""}
        </h2>

        <p>
          View the complete 30-day prayer schedule
          calculated for your selected location in{" "}
          {location.city}
          {location.country
            ? `, ${location.country}`
            : ""}.
        </p>

        <div className="prayer-time-schedule-list">
          {schedule.map((day) => (
            <div
              className="prayer-time-day"
              key={day.date}
            >
             <div className="prayer-time-day-heading">
  <span>Prayer</span>

  <span>
    {day.month}{" "}
    {Number(day.date.slice(8, 10))},{" "}
    {day.date.slice(0, 4)}
  </span>

  <strong>{day.weekday}</strong>

  <small className="prayer-time-hijri-schedule">
    ({formatScheduleHijriDate(day.date)})
  </small>
</div>
              <div className="prayer-time-table-wrapper">
                <table className="prayer-time-table">
                  <thead>
                    <tr>
                      <th>Fajr-Time</th>
                      <th>Dhuhr-Time</th>
                      <th>Asr-Time</th>
                      <th>Maghrib-Time</th>
                      <th>Isha-Time</th>
                      <th>Sunrise-Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>{day.fajr}</td>
                      <td>{day.dhuhr}</td>
                      <td>{day.asr}</td>
                      <td>{day.maghrib}</td>
                      <td>{day.isha}</td>
                      <td>{day.sunrise}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="prayer-time10">
        <h2>Frequently Asked Questions</h2>

        <div className="prayer-time-faq-list">
          {prayerTimeSeo.faqs.map((faq, index) => (
            <details
              className="prayer-time-faq-item"
              key={index}
            >
              <summary>
                <h3>{faq.question}</h3>

                <span className="prayer-time-faq-icon">
                  +
                </span>
              </summary>

              <div className="prayer-time-faq-answer">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="prayer-time-footer">
        <p>
          Prayer times are calculated locally using the
          Adhan JavaScript library.
        </p>

        <p>
          Times may vary according to local calculation methods.
        </p>
      </footer>
    </main>
  );
}