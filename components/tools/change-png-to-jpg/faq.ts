export interface FAQItem {
  question: string;
  answer: string;
}

export interface SlugConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  h1Title: string;
  introText: string;
  article: {
    title: string;
    sections: {
      heading: string;
      level: "h2" | "h3" | "h4";
      content: string;
    }[];
  };
  faqs: FAQItem[];
}

export const changePngToJpgConfig: Record<string, SlugConfig> = {

  "format-png-to-jpg": {
    metaTitle: "Format PNG to JPG Online Free - Fast Image Converter",
    metaDescription:
      "Format PNG to JPG online for free with our fast image converter. Convert multiple PNG images into JPG format directly in your browser with easy downloads.",
    keywords: [
      "format png to jpg",
      "png to jpg format online",
      "format png image to jpg"
    ],
    h1Title: "Format PNG to JPG Online for Free",
    introText:
      "Looking for an easy way to format PNG to JPG? Our free online converter helps you transform PNG images into JPG files quickly. Upload your images, adjust the available settings, and download your converted files without installing software.",
    article: {
      title: "Complete Guide to Formatting PNG Images to JPG",
      sections: [
        {
          heading: "What Does Formatting PNG to JPG Mean?",
          level: "h2",
          content:
            "Formatting PNG to JPG means converting an image from the PNG file format into JPEG format. JPG uses lossy compression to reduce file size, making it useful for sharing photographs, uploading images, and saving storage space."
        },
        {
          heading: "Why Convert PNG Images into JPG?",
          level: "h3",
          content:
            "JPG images generally require less storage space than PNG files, especially for photographs. Converting PNG images to JPG can make uploads faster and help websites load images more efficiently."
        },
        {
          heading: "How to Format PNG Images Online",
          level: "h4",
          content:
            "Select your PNG images using the upload option, review the available conversion settings, and start the conversion. Once processing finishes, download your JPG images individually or together if batch downloading is supported."
        }
      ]
    },
    faqs: [
      {
        question: "How can I format PNG to JPG online?",
        answer:
          "Upload your PNG image to the converter, choose the available JPG conversion option, and start processing. You can download the resulting JPG file when the conversion is complete."
      },
      {
        question: "Is this PNG to JPG format tool free?",
        answer:
          "Yes, you can use this online PNG to JPG converter for free without creating an account or installing additional software."
      },
      {
        question: "Does formatting PNG to JPG reduce image quality?",
        answer:
          "JPG uses lossy compression, so some image information may be lost during conversion. You can use an appropriate quality setting to maintain a good visual appearance."
      }
    ]
  },

  "change-png-to-jpg": {
    metaTitle: "Change PNG to JPG Online - Free & Fast Image Converter",
    metaDescription:
      "Change PNG to JPG online using our free converter. Convert single or multiple PNG images directly in your browser with simple controls and quick downloads.",
    keywords: [
      "change png to jpg",
      "convert png format to jpg",
      "change png image to jpeg"
    ],
    h1Title: "Change PNG to JPG Online Instantly",
    introText:
      "Need to change PNG to JPG? Our online image converter makes it simple to transform PNG files into JPG format. Upload your images, choose your preferred settings, and convert them directly in your browser.",
    article: {
      title: "Everything You Need to Know About Changing PNG to JPG",
      sections: [
        {
          heading: "Why Change PNG to JPG Format?",
          level: "h2",
          content:
            "PNG files support transparency and lossless image storage, while JPG is commonly used for photographs and web images. Changing PNG to JPG can reduce file sizes and make images easier to share across different platforms."
        },
        {
          heading: "How to Change PNG to JPG on Different Devices",
          level: "h3",
          content:
            "You can change PNG images to JPG using a desktop computer, laptop, tablet, or smartphone. Open the converter in a compatible browser, select your image files, and complete the conversion online."
        },
        {
          heading: "Does Changing PNG to JPG Remove Transparency?",
          level: "h4",
          content:
            "Yes. JPG does not support transparent backgrounds. Transparent areas in a PNG image must be replaced with a solid background color during conversion."
        }
      ]
    },
    faqs: [
      {
        question: "How do I change PNG to JPG on my phone?",
        answer:
          "Open the converter in your mobile browser, select a PNG image from your device, and start the conversion. Download the resulting JPG image when processing is finished."
      },
      {
        question: "Are my images safe when changing PNG to JPG?",
        answer:
          "When conversion is performed locally in your browser, your image files do not need to be uploaded to an external conversion server. This helps protect your privacy."
      },
      {
        question: "Can I change multiple PNG files to JPG at once?",
        answer:
          "Yes, the tool supports batch image processing when multiple files are selected. You can convert several PNG images and download the results using the available download options."
      }
    ]
  },

  "png-to-jpg-convert-online": {
    metaTitle: "PNG to JPG Convert Online Free - Quick Image Converter",
    metaDescription:
      "PNG to JPG convert online for free with a simple browser-based tool. Transform PNG images into JPG format quickly without installing any software.",
    keywords: [
      "png to jpg convert online",
      "online png to jpg converter",
      "convert png to jpg online free"
    ],
    h1Title: "PNG to JPG Convert Online Free",
    introText:
      "Convert PNG to JPG online without downloading additional applications. Our browser-based image converter provides a convenient way to change PNG files into JPG format with simple controls and quick results.",
    article: {
      title: "How Online PNG to JPG Conversion Works",
      sections: [
        {
          heading: "What Is an Online PNG to JPG Converter?",
          level: "h2",
          content:
            "An online PNG to JPG converter is a browser-based utility that changes PNG images into JPEG files. It uses image processing capabilities available in modern browsers to create downloadable JPG images."
        },
        {
          heading: "Benefits of Converting PNG to JPG Online",
          level: "h3",
          content:
            "Online conversion saves time because you do not need to install desktop applications. You can access the tool from different devices and convert images whenever you need them."
        },
        {
          heading: "Supported Image Formats and Conversion",
          level: "h4",
          content:
            "The converter accepts supported image formats according to its upload settings. PNG files can be converted into JPG images, allowing users to create files suitable for common websites, email attachments, and digital sharing."
        }
      ]
    },
    faqs: [
      {
        question: "How can I convert PNG to JPG online for free?",
        answer:
          "Choose your PNG image, upload it to the online converter, and start the conversion. After processing, download your JPG image directly to your device."
      },
      {
        question: "Which image formats can I upload?",
        answer:
          "Supported input formats depend on the converter's file selection settings. Common formats may include PNG, JPG, JPEG, and WEBP."
      },
      {
        question: "Do I need to install software to convert PNG to JPG?",
        answer:
          "No. You can use the online converter through a modern web browser without installing a separate image conversion application."
      }
    ]
  },

  "photo-png-to-jpg-convert": {
    metaTitle: "Photo PNG to JPG Convert Online - Free Photo Converter",
    metaDescription:
      "Convert photo PNG to JPG online with a free image converter. Change photo formats, adjust available dimensions, process multiple images, and download JPG files.",
    keywords: [
      "photo png to jpg convert",
      "convert png photo to jpg",
      "image converter png to jpg"
    ],
    h1Title: "Photo PNG to JPG Convert Online",
    introText:
      "Convert your PNG photos into JPG format with an easy online image conversion tool. Select your pictures, adjust the available image settings, and download your converted photos in just a few steps.",
    article: {
      title: "A Practical Guide to Converting PNG Photos to JPG",
      sections: [
        {
          heading: "Why Convert PNG Photos into JPG?",
          level: "h2",
          content:
            "JPG is a widely supported image format that works well for digital photography, online publishing, and everyday sharing. Converting PNG photos into JPG can help reduce file sizes while keeping images visually clear when an appropriate quality setting is selected."
        },
        {
          heading: "Adjust Photo Dimensions Before Conversion",
          level: "h3",
          content:
            "Some image converters provide width and height controls that let you resize pictures before saving them as JPG files. Choosing suitable dimensions can help prepare images for websites, social media, and other digital platforms."
        },
        {
          heading: "Download Converted Photos Individually or Together",
          level: "h4",
          content:
            "After conversion, you can save individual JPG images or use the available batch download feature to collect multiple converted photos together."
        }
      ]
    },
    faqs: [
      {
        question: "How do I convert a PNG photo to JPG?",
        answer:
          "Select your PNG photo, add it to the converter, and start the JPG conversion. Once processing is complete, save the converted photo to your device."
      },
      {
        question: "Can I resize a PNG photo before converting it to JPG?",
        answer:
          "If the converter provides custom dimension controls, you can enter your preferred width and height before starting the conversion."
      },
      {
        question: "Can I download all converted photos together?",
        answer:
          "Yes, if batch downloading is available, you can download multiple converted JPG photos together instead of saving each image separately."
      }
    ]
  }

};