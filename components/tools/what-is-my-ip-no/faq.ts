export interface FaqItem {
  question: string;
  answer: string;
}

export const speedTestFaqs: FaqItem[] = [
  {
    question: "What is my IP no and why is it important to know?",
    answer: "Your IP number (Internet Protocol address) is a unique numerical label assigned to every device connected to a computer network that uses the Internet Protocol for communication. Knowing what is my IP no is crucial for network troubleshooting, remote desktop access, online gaming, setting up server firewalls, and understanding how websites and online services identify your approximate geographic location and internet service provider."
  },
  {
    question: "How can I check what is my IP no accurately?",
    answer: "You can easily check what is my IP no by visiting our dedicated tool page. The tool automatically detects and displays your public IPv4 and IPv6 addresses instantly upon loading. It also utilizes advanced geolocation databases and browser APIs to fetch your precise or approximate country, region, city, zip postal code, and exact map location without requiring any manual setup or third-party software installation."
  },
  {
    question: "What is the difference between IPv4 and IPv6 addresses?",
    answer: "IPv4 is the fourth revision of the Internet Protocol and uses 32-bit addresses, which limits the total number of unique addresses to roughly 4.3 billion. Due to the massive growth of connected devices, IPv6 was introduced using 128-bit addresses, providing a virtually limitless supply of unique identifiers formatted in hexadecimal strings. Both versions help route packets across global networks, and our tool detects both your IPv4 and IPv6 addresses simultaneously."
  },
  {
    question: "Does this tool show my exact physical location or just my ISP location?",
    answer: "When you first load the page, the tool displays an approximate location based on your public IP routing tables managed by your Internet Service Provider (ISP). However, if you grant browser geolocation permission when prompted, our system queries your device GPS sensors to pinpoint your exact coordinates on the interactive Leaflet map, displaying accurate latitude and longitude details for maximum precision."
  },
  {
    question: "Is my IP address and personal data secure when using this tool?",
    answer: "Yes, your privacy and security are completely protected. Our what is my IP no tool performs client-side detection and communicates securely over encrypted HTTPS protocols with trusted IP lookup APIs. We do not store, log, or share your personal IP addresses, browsing patterns, or precise geographic coordinates on our servers, ensuring 100% confidentiality during every diagnostic session."
  },
  {
    question: "Why does my IP location look different from my actual city?",
    answer: "An IP address location is determined by where your Internet Service Provider (ISP) routes your connection through their regional data centers or core gateway servers rather than your exact residential street address. If your ISP routes traffic through a neighboring city or capital hub, your IP-based geolocation might display that hub city instead of your physical neighborhood until you enable precise browser geolocation."
  },
  {
    question: "Can I use this tool on mobile phones, tablets, and desktop computers?",
    answer: "Absolutely! Our what is my IP no utility is fully responsive and optimized for all modern platforms, including Android smartphones, iPhones, iPads, Windows laptops, and macOS desktop workstations. It automatically detects your operating system, browser brand, device type, and version parameters, rendering a clean, lightning-fast interface regardless of the screen size or device you are using."
  },
  {
    question: "How do I copy my IP address to the clipboard quickly?",
    answer: "To copy your IP address, simply locate the IPv4 or IPv6 display box on the main card and click the dedicated 'Copy' button located right next to the IP label. The button text will instantly change to 'Copied!' with visual feedback, confirming that your public IP address has been successfully saved to your device clipboard for effortless pasting into configuration files or chat windows."
  },
  {
    question: "What information does the device and browser info card provide?",
    answer: "The device and browser information card analyzes your browser user-agent string to identify your active browser name (such as Chrome, Firefox, Safari, or Edge), exact browser version, underlying operating system (such as Windows, macOS, Linux, Android, or iOS), and device classification (Desktop, Mobile, or Tablet), giving you a comprehensive overview of your digital fingerprint in real time."
  },
  {
    question: "How do I refresh my IP and network connection details?",
    answer: "If your network connection drops, you switch between Wi-Fi and mobile data, or you want to verify updated routing parameters, you can simply click the '⟳ Refresh' button at the bottom of the main card. This action re-fetches live IP data, updates the current local time, re-centers the interactive map, and checks your device location permission status instantly."
  }
];