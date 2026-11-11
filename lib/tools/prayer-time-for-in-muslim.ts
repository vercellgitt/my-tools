import { prayerTimeSeo } from "@/components/tools/prayer-time-for-in-muslim/seo";

export const prayerTimeForInMuslim = {
  slug: "prayer-time-for-muslim-namaz-time-in",

  title: prayerTimeSeo.title,

  description: prayerTimeSeo.description,

  keywords: prayerTimeSeo.keywords,

  faqs: prayerTimeSeo.faqs,

  load: () =>
    import(
      "@/components/tools/prayer-time-for-in-muslim/prayer-time-for-in-muslim"
    ),
};