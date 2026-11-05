export interface FAQItem {
  question: string;
  answer: string;
}

export interface ArticleContent {
  title: string;
  intro: string;
  faqs: FAQItem[];
}