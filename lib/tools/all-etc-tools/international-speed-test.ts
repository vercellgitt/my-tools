export const internationalSpeedTest = {
  slug: "international-speed-test",
  title: "International Speed Test: Check Internet Speed & IP Address",
  description: "Run an international speed test to check your internet connection speed, download, upload, ping, and precise IP location details instantly online.",
  load: () =>
    import("@/components/tools/international-speed-test/international-speed-test"),
};