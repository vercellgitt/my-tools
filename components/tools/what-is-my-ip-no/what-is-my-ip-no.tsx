"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import DOMPurify from "isomorphic-dompurify";
import { speedTestFaqs } from "./faq";
import "./what-is-my-ip-no.css";

export default function WhatIsMyIpNoTool() {
const [currentIPv4, setCurrentIPv4] = useState<string>("Loading...");
const [currentIPv6, setCurrentIPv6] = useState<string>("Loading...");
const [country, setCountry] = useState<string>("—");
const [city, setCity] = useState<string>("—");
const [region, setRegion] = useState<string>("—");
const [postal, setPostal] = useState<string>("—");
const [timezone, setTimezone] = useState<string>("—");
const [browser, setBrowser] = useState<string>("—");
const [browserVersion, setBrowserVersion] = useState<string>("—");
const [os, setOs] = useState<string>("—");
const [deviceType, setDeviceType] = useState<string>("—");
const [coordsText, setCoordsText] = useState<string>("");
const [currentTime, setCurrentTime] = useState<string>("");
const [showLocationWarning, setShowLocationWarning] = useState<boolean>(false);
const [copiedIp4, setCopiedIp4] = useState<boolean>(false);
const [copiedIp6, setCopiedIp6] = useState<boolean>(false);
const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

// Initialize tool
useEffect(() => {
try {
const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
if (userTimeZone) setTimezone(userTimeZone);
} catch (e) {}

updateDeviceInfo();
updateCurrentTime();
fetchIPData();
getPreciseLocation();
checkLocationPermissionStatus();

const timer = setInterval(() => {
  updateCurrentTime();
}, 60000);

return () => clearInterval(timer);

}, []);

// Device and browser information
const updateDeviceInfo = () => {
const ua = navigator.userAgent;

let bName = "Unknown";
let bVer = "";
let systemOS = "Unknown";
let dType = "Desktop";

if (
  ua.indexOf("Chrome") > -1 &&
  ua.indexOf("Edg") === -1 &&
  ua.indexOf("OPR") === -1
) {
  bName = "Chrome";
} else if (ua.indexOf("Firefox") > -1) {
  bName = "Firefox";
} else if (
  ua.indexOf("Safari") > -1 &&
  ua.indexOf("Chrome") === -1
) {
  bName = "Safari";
} else if (ua.indexOf("Edg") > -1) {
  bName = "Edge";
}

const vMatch = ua.match(/(Chrome|Firefox|Safari|Edg)\/(\d+)/);

if (vMatch) bVer = vMatch[2];

if (/Android/i.test(ua)) {
  systemOS = "Android";
  dType = "Mobile";
} else if (/iPhone|iPad|iPod/i.test(ua)) {
  systemOS = "iOS";
  dType = /iPad/i.test(ua) ? "Tablet" : "Mobile";
} else if (/Windows/i.test(ua)) {
  systemOS = "Windows";
} else if (/Macintosh|Mac OS X/i.test(ua)) {
  systemOS = "macOS";
} else if (/Linux/i.test(ua)) {
  systemOS = "Linux";
}

if (/Mobi|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
  dType = "Mobile";
} else if (/Tablet|iPad/i.test(ua)) {
  dType = "Tablet";
}

setBrowser(bName);
setBrowserVersion(bVer || "—");
setOs(systemOS);
setDeviceType(dType);

};

// Current time
const updateCurrentTime = () => {
const now = new Date();

const options: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
};

setCurrentTime(now.toLocaleDateString("en-US", options));

};

// Location permission status
const checkLocationPermissionStatus = () => {
if (navigator.permissions && navigator.permissions.query) {
navigator.permissions
.query({ name: "geolocation" as PermissionName })
.then((permissionStatus) => {
setShowLocationWarning(permissionStatus.state !== "granted");

      permissionStatus.onchange = function () {
        if (this.state === "granted") {
          setShowLocationWarning(false);
          getPreciseLocation();
        } else {
          setShowLocationWarning(true);
        }
      };
    })
    .catch(() => {
      setShowLocationWarning(true);
    });
}

};

// Initialize Leaflet map
const initMap = (
lat: number,
lon: number,
locationInfo: string,
ip4: string,
ip6: string
) => {
if (typeof window === "undefined") return;

const leafletWindow = window as any;

if (!leafletWindow.L) {
  const script = document.createElement("script");

  script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  script.async = true;

  script.onload = () => {
    renderMapInstance(lat, lon, locationInfo, ip4, ip6);
  };

  document.body.appendChild(script);

  if (!document.getElementById("leaflet-css")) {
    const link = document.createElement("link");

    link.id = "leaflet-css";
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

    document.head.appendChild(link);
  }
} else {
  renderMapInstance(lat, lon, locationInfo, ip4, ip6);
}

};

// Render map with accessible images
const renderMapInstance = (
lat: number,
lon: number,
locationInfo: string,
ip4: string,
ip6: string
) => {
const leafletWindow = window as any;
const mapEl = document.getElementById("map");

if (!mapEl) return;

if (leafletWindow._currentMap) {
  leafletWindow._currentMap.remove();
}

const map = leafletWindow.L.map("map").setView([lat, lon], 14);

leafletWindow._currentMap = map;

// Add OpenStreetMap tiles
leafletWindow.L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
  }
).addTo(map);

// Add accessible alt text to all Leaflet images
const addMapImageAlt = () => {
  mapEl.querySelectorAll("img").forEach((img: HTMLImageElement) => {
    if (img.classList.contains("leaflet-tile")) {
      img.alt = "OpenStreetMap map tile";
    } else if (img.classList.contains("leaflet-marker-icon")) {
      img.alt = "Map location marker";
    } else if (img.classList.contains("leaflet-marker-shadow")) {
      img.alt = "Map marker shadow";
    } else if (!img.hasAttribute("alt")) {
      img.alt = "Map image";
    }
  });
};

// Set alt text immediately
addMapImageAlt();

// Monitor newly loaded map images
const mapObserver = new MutationObserver(() => {
  addMapImageAlt();
});

mapObserver.observe(mapEl, {
  childList: true,
  subtree: true,
});

// Disconnect observer when map is removed
map.on("unload", () => {
  mapObserver.disconnect();
});

// Map popup content
let popupContent = `<b>${locationInfo}</b><br><br>`;

if (ip4 && ip4 !== "Error" && ip4 !== "Loading...") {
  popupContent += `<strong>IPv4:</strong> ${ip4}<br>`;
}

if (ip6 && ip6 !== "Not detected" && ip6 !== "Loading...") {
  popupContent += `<strong>IPv6:</strong> ${ip6}`;
}

// Location marker with accessible alt text
const marker = leafletWindow.L.marker([lat, lon], {
  alt: "Map location marker",
}).addTo(map);

marker.bindPopup(popupContent).openPopup();

};

// Fetch public IP information
const fetchIPData = async () => {
setCurrentIPv4("Loading...");
setCurrentIPv6("Loading...");

try {
  const ipv4Res = await fetch("https://api.ipify.org?format=json");
  const ipv4Data = await ipv4Res.json();
  const ip4 = ipv4Data.ip;

  setCurrentIPv4(ip4);

  let ip6 = "Not detected";

  try {
    const ipv6Res = await fetch("https://api64.ipify.org?format=json");
    const ipv6Data = await ipv6Res.json();

    if (ipv6Data.ip && ipv6Data.ip !== ip4) {
      ip6 = ipv6Data.ip;
    }
  } catch (e) {}

  setCurrentIPv6(ip6);

  const geoRes = await fetch(`https://ipwho.is/${ip4}`);
  const geoData = await geoRes.json();

  if (geoData.success) {
    const countryName = geoData.country || "Unknown";
    const countryCode = geoData.country_code || "";

    let flag = "";

    if (countryCode) {
      flag = String.fromCodePoint(
        ...countryCode
          .split("")
          .map((c: string) => 127397 + c.charCodeAt(0))
      );
    }

    setCountry(`${flag} ${countryName} (${countryCode})`);
    setCity(geoData.city || "Unknown");
    setRegion(geoData.region || "Unknown");
    setPostal(geoData.postal || "—");

    if (geoData.timezone?.id) {
      setTimezone(geoData.timezone.id);
    }

    const lat = geoData.latitude;
    const lon = geoData.longitude;

    if (lat && lon) {
      setCoordsText(
        `Lat: ${lat.toFixed(4)} • Lon: ${lon.toFixed(4)} (IP-based)`
      );

      const fullLocation = `${geoData.city || ""}, ${geoData.region || ""}, ${geoData.country || ""}`
        .replace(/,\s*,/g, ",")
        .replace(/^,\s*/, "")
        .replace(/,\s*$/, "");

      initMap(
        lat,
        lon,
        fullLocation || "Your Approximate Location",
        ip4,
        ip6
      );
    }
  }
} catch (error) {
  setCurrentIPv4("Error");
  setCurrentIPv6("Not detected");
}

};

// Get precise device location
const getPreciseLocation = () => {
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(
async (position) => {
const lat = position.coords.latitude;
const lon = position.coords.longitude;

      setShowLocationWarning(false);

      setCoordsText(
        `Lat: ${lat.toFixed(5)} • Lon: ${lon.toFixed(5)} (Precise)`
      );

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );

        const data = await res.json();
        const addr = data.address || {};

        const displayName =
          data.display_name ||
          `${lat.toFixed(5)}, ${lon.toFixed(5)}`;

        setCountry(addr.country || "Unknown");

        setRegion(
          addr.state_district ||
            addr.county ||
            addr.state ||
            "Unknown"
        );

        setCity(
          addr.city ||
            addr.town ||
            addr.village ||
            addr.suburb ||
            addr.municipality ||
            "Unknown"
        );

        setPostal(addr.postcode || "—");

        initMap(
          lat,
          lon,
          displayName,
          currentIPv4,
          currentIPv6
        );
      } catch (e) {
        initMap(
          lat,
          lon,
          "Your Precise Location",
          currentIPv4,
          currentIPv6
        );
      }
    },
    (error) => {
      setShowLocationWarning(true);
    }
  );
} else {
  setShowLocationWarning(true);
}

};

// Copy IP address
const copyIP = (text: string, type: "ipv4" | "ipv6") => {
if (
!text ||
text === "Loading..." ||
text === "Error" ||
text === "Not detected"
) {
return;
}

navigator.clipboard.writeText(text).then(() => {
  if (type === "ipv4") {
    setCopiedIp4(true);
    setTimeout(() => setCopiedIp4(false), 1500);
  } else {
    setCopiedIp6(true);
    setTimeout(() => setCopiedIp6(false), 1500);
  }
});

};

// Refresh data
const refreshData = async () => {
await fetchIPData();
getPreciseLocation();
updateCurrentTime();
};

return (
<>
<Head>
<title>
What Is My IP No? Check IP Address, Location & ISP Online
</title>

    <meta
      name="description"
      content="Find out what is my ip no instantly. Check your public IPv4 and IPv6 addresses, precise geolocation, ISP details, time zone, and interactive map online securely."
    />
  </Head>

  <div className="what-is-my-ip1">
    <div className="what-is-my-ip2">

      {/* Main IP Display */}

      <div className="what-is-my-ip4">

        <div className="what-is-my-ip5">
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "9px",
              height: "9px",
              background: "#166534",
              borderRadius: "50%",
              flexShrink: 0,
            }}
          ></span>

          Connected • Live
        </div>

        <h1
          className="what-is-my-ip3"
          style={{ fontSize: "1.8rem" }}
        >
          What Is My IP No: See exact IP address number with location
        </h1>

        <div className="what-is-my-ip6">

          <div className="what-is-my-ip7">
            <div className="what-is-my-ip8">
              <span className="what-is-my-ip9">IPv4:</span>

              <button
                className="what-is-my-ip10"
                onClick={() => copyIP(currentIPv4, "ipv4")}
                type="button"
              >
                {copiedIp4 ? "Copied!" : "Copy"}
              </button>
            </div>

            <span className="what-is-my-ip11">
              {currentIPv4}
            </span>
          </div>

          <div className="what-is-my-ip7">
            <div className="what-is-my-ip8">
              <span className="what-is-my-ip9">IPv6:</span>

              <button
                className="what-is-my-ip10"
                onClick={() => copyIP(currentIPv6, "ipv6")}
                type="button"
              >
                {copiedIp6 ? "Copied!" : "Copy"}
              </button>
            </div>

            <span className="what-is-my-ip12">
              {currentIPv6}
            </span>
          </div>

        </div>

        {/* Location Warning and Refresh Button */}

        {showLocationWarning && (
          <>
            <div className="what-is-my-ip13">
              ⚠️ Please turn on your device location then click Refresh Button get for accurate details and map location
            </div>

            <div className="what-is-my-ip31">
              <button
                className="what-is-my-ip32"
                onClick={refreshData}
                type="button"
              >
                ⟳ Refresh
              </button>
            </div>
          </>
        )}

      </div>

      <div className="what-is-my-ip14">

        {/* Location */}

        <div className="what-is-my-ip15">

          <div className="what-is-my-ip16">
            <span>🌍</span>
            <span>LOCATION</span>
          </div>

          <div>

            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.85rem", color: "#030e1e" }}>
                Country
              </div>

              <div className="what-is-my-ip17 what-is-my-ip18">
                {country}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.85rem", color: "#010811" }}>
                  City
                </div>

                <div className="what-is-my-ip17 what-is-my-ip19">
                  {city}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.85rem", color: "#010915" }}>
                  Region
                </div>

                <div className="what-is-my-ip17 what-is-my-ip20">
                  {region}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.85rem", color: "#010710" }}>
                  ZIP / Postal
                </div>

                <div className="what-is-my-ip17 what-is-my-ip21">
                  {postal}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.85rem", color: "#000307" }}>
                  Time Zone
                </div>

                <div className="what-is-my-ip17 what-is-my-ip22">
                  {timezone}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Device */}

        <div className="what-is-my-ip15">

          <div className="what-is-my-ip16">
            <span>💻</span>
            <span>DEVICE & BROWSER</span>
          </div>

          <div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.85rem", color: "#010711" }}>
                  Browser
                </div>

                <div className="what-is-my-ip17 what-is-my-ip23">
                  {browser}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.85rem", color: "#010915" }}>
                  Version
                </div>

                <div className="what-is-my-ip17 what-is-my-ip24">
                  {browserVersion}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.85rem", color: "#020e1f" }}>
                  OS
                </div>

                <div className="what-is-my-ip17 what-is-my-ip25">
                  {os}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.85rem", color: "#020a16" }}>
                  Device
                </div>

                <div className="what-is-my-ip17 what-is-my-ip26">
                  {deviceType}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Map */}

      <div className="what-is-my-ip27">

        <div className="what-is-my-ip28">

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <h2 style={{ fontSize: "1.55rem", margin: 0 }}>
              📍 Approximate Location
            </h2>

            <div
              style={{
                fontSize: "0.95rem",
                color: "#020e1e",
                fontWeight: 600,
              }}
            >
              {coordsText}
            </div>
          </div>

          <div
            style={{
              fontSize: "1rem",
              color: "#000813",
              fontWeight: 600,
            }}
          >
            {currentTime}
          </div>

        </div>

        <div className="what-is-my-ip29">
          <div id="map" className="what-is-my-ip30"></div>
        </div>

      </div>

      {/* Tool Image */}

      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          margin: "30px auto",
          textAlign: "center",
        }}
      >
        <img
          src="/images/what-is-my-ip-no.webp"
          alt="what is my ip no"
          width="800"
          height="450"
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            borderRadius: "10px",
          }}
        />
      </div>

      {/* SEO & FAQ Section */}

      <section className="case-converter-seo-section">

        <h2>
          Understanding What Is My IP No and Network Diagnostics
        </h2>

        <p>
          When navigating the digital world, knowing{" "}
          <strong>what is my ip no</strong> is essential for effective
          network monitoring, online security assessment, and
          troubleshooting connectivity issues. Every active device
          connected to the internet requires a unique numerical
          identifier known as an Internet Protocol (IP) address. This
          identifier allows web servers, applications, and routers to
          route data packets precisely back to your browser.
        </p>

        <p>
          Our comprehensive web utility provides real-time detection
          of both IPv4 and IPv6 protocols alongside detailed hardware
          and geographic data. Whether you are configuring firewall
          rules, setting up secure remote desktop access, or
          diagnosing latency bottlenecks, having immediate access
          to accurate IP data ensures seamless online operations.
          For further reading on internet protocols and network
          routing standards, you can explore resources on{" "}
          <a
            href="https://en.wikipedia.org/wiki/IP_address"
            target="_blank"
            rel="noopener noreferrer"
          >
            IP Addresses on Wikipedia
          </a>{" "}
          or check out global standards at the{" "}
          <a
            href="https://www.ietf.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            IETF Official Website
          </a>.
        </p>

        <h2>
          Frequently Asked Questions About What Is My IP No
        </h2>

        <div>
          {speedTestFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;

            return (
              <div key={index} className="faq-accordion-item">

                <button
                  className="faq-question-btn"
                  onClick={() =>
                    setOpenFaqIndex(isOpen ? null : index)
                  }
                  type="button"
                >
                  <span>{faq.question}</span>

                  <span aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="faq-answer-box">
                    <p
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: "1.6",
                        color: "#475569",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(faq.answer),
                      }}
                    />
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </section>

    </div>
  </div>
</>

);
}