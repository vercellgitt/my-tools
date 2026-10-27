import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // এটি যোগ করতে হবে স্ট্যাটিক এক্সপোর্টের জন্য
  images: {
    unoptimized: true, // স্ট্যাটিক সাইটের জন্য ইমেজ অপ্টিমাইজেশন বন্ধ রাখা ভালো
  },
};

export default nextConfig;
