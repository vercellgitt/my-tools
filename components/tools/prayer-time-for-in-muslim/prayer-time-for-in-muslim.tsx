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

export default function PrayerTimeForInMuslim() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [prayers, setPrayers] = useState<PrayerItem[]>([]);
  const [sunrise, setSunrise] = useState<Date | null>(null);

  const [schedule, setSchedule] = useState<
    ReturnType<typeof get30DaySchedule>
  >([]);

  const [nextPrayer, setNextPrayer] = useState<PrayerItem | null>(null);
  const [nextDayPrayers, setNextDayPrayers] = useState<PrayerItem[]>([]);
  const [countdown, setCountdown] = useState("");
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hanafi, setHanafi] = useState(false);

  const getLocation = useCallback(() => {
    setLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        let city = "Your Location";
        let country = "";

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );

          if (response.ok) {
            const data = await response.json();
            const address = data.address || {};

            city =
              address.city ||
              address.town ||
              address.village ||
              address.suburb ||
              address.county ||
              "Your Location";

            country = address.country || "";
          }
        } catch {
          // Location coordinates remain usable.
        }

        setLocation({
          latitude,
          longitude,
          city,
          country,
        });

        setLoading(false);
      },
      () => {
        setError(
          "Location access denied. Please allow location permission and try again."
        );
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    if (!location) return;

    setSchedule(
      get30DaySchedule(
        location.latitude,
        location.longitude,
        hanafi
      )
    );
  }, [location, hanafi]);

  useEffect(() => {
    if (!location) return;

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

      // Wait one full hour after Isha before showing next Fajr.
      const ishaGraceEnd = new Date(
        todayTimes.isha.getTime() + 60 * 60 * 1000
      );

      let next: PrayerItem | null = null;

      if (current.getTime() < todayTimes.isha.getTime()) {
        next =
          allPrayers.find(
            (item) => item.time.getTime() > current.getTime()
          ) || null;
      } else if (current.getTime() >= ishaGraceEnd.getTime()) {
        next = tomorrowPrayers[0];
      }

      setNextPrayer(next);

      if (!next) {
        setCountdown("");
        return;
      }

      const difference =
        next.time.getTime() - current.getTime();

      const hours = Math.floor(difference / 3600000);

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
          `${minutes} ${minutes === 1 ? "Minute" : "Minutes"}`
        );
      }

      if (seconds > 0) {
        countdownParts.push(
          `${seconds} ${seconds === 1 ? "Second" : "Seconds"}`
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

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

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

  if (loading) {
    return (
      <div className="prayer-time1">
        <p className="prayer-time-loading">
          Detecting your location...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prayer-time1">
        <p className="prayer-time-error">{error}</p>

        <button
          className="prayer-time-button"
          onClick={getLocation}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="prayer-time1">
      <header className="prayer-time2">
        <h1>
          Prayer Time for Muslim | Namaz Time in All Countries Today
        </h1>

        <p>
          Accurate Muslim prayer times for your current location.
        </p>

        {location && (
          <div className="prayer-time-location">
            📍 {location.city}, {location.country}
          </div>
        )}
      </header>

      {/* Prayer Calculation Method */}
      <section className="prayer-time-method">
        <h2>Prayer Calculation Method</h2>

        <label>
          <input
            type="checkbox"
            checked={hanafi}
            onChange={(e) => setHanafi(e.target.checked)}
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

          <button
            className="prayer-time-button"
            onClick={getLocation}
          >
            Refresh Location
          </button>
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
                ) : passedMoreThan30Minutes && tomorrowPrayer ? (
                  <div className="prayer-time-upcoming">
                    <span>Upcoming Prayer</span>

                    <strong>{prayer.name}</strong>

                    <span>
                      {formatTime(tomorrowPrayer.time)}
                    </span>

                    <small>
                      {formatUpcomingDate(tomorrowPrayer.time)}
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
          {location?.city}
          {location?.country
            ? `, ${location.country}`
            : ""}
        </h2>

        <p>
          View the complete 30-day prayer schedule
          calculated for your location in{" "}
          {location?.city}
          {location?.country
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