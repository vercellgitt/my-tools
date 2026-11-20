export interface FaqItem {
  question: string;
  answer: string;
}

export const letterCaseConverterFaqs: FaqItem[] = [
  {
    question: "How does an online letter case converter work on your text?",
    answer:
      "A reliable letter case converter takes raw text from your editor and transforms every letter according to the selected formatting rule without altering punctuation or spacing unnecessarily. When you use this letter case converter, it processes uppercase, lowercase, title case, sentence case, alternating case, inverse case, random case, and small caps directly inside your browser. Because conversion runs client-side, your typed or pasted content stays private while updating character count, word count, sentence count, and estimated reading time immediately. You can also toggle live conversion to see changes in real time or click convert manually, undo previous edits, copy formatted output with one click, and keep your working state saved locally between sessions.",
  },
  {
    question: "Why should writers use a case converter before publishing content?",
    answer:
      "Using a dedicated case converter helps writers catch inconsistent capitalization across headings, paragraphs, social media captions, and email subject lines before publishing. Accidental caps lock, mixed letter styles, or improper title capitalization can make an article look rushed and reduce reader trust. With this case converter, you can quickly standardize headlines into Title Case, smooth out body paragraphs into Sentence case, or create lowercase text for clean tags and handles. It saves manual retyping, reduces human error during tight deadlines, and ensures your formatting remains consistent across blogs, newsletters, marketing copy, documentation, and presentations.",
  },
  {
    question: "When is changing a letter format helpful for coding and data tasks?",
    answer:
      "Adjusting a letter format is very helpful when cleaning raw lists, preparing configuration values, normalizing labels, or inspecting mixed-case strings copied from spreadsheets and logs. While programming identifiers often follow strict conventions, quickly switching a letter block between uppercase and lowercase lets you compare values, format constants, or clean user-submitted text snippets faster. This tool preserves line numbers and prevents long lines from breaking awkwardly, making it practical for quick text cleanup. Although it does not replace a full code linter or database migration script, it speeds up everyday text formatting tasks right inside your browser.",
  },
  {
    question: "What makes a text converter different from basic word processor formatting?",
    answer:
      "A focused text converter is built specifically for rapid, multi-mode letter transformations without opening heavy document suites or hunting through nested menu ribbons. In addition to standard uppercase, lowercase, and sentence formatting, this text converter includes creative and specialized modes like alternating case, inverse case, random case, and Unicode small caps. It also provides instant statistics for characters, words, sentences, and reading time alongside a convenient paste button and undo history. For quick copy-paste workflows across browsers and mobile devices, a lightweight web converter delivers faster access and fewer distractions than full office software.",
  },
  {
    question: "How does Title Case differ from Sentence case in text formatting?",
    answer:
      "Title Case capitalizes the principal words of a headline, book title, or section heading while keeping short connecting words like articles, conjunctions, and prepositions lowercase unless they appear first or last. Sentence case, by contrast, capitalizes only the first letter of a sentence and after terminal punctuation such as periods, exclamation marks, or question marks, keeping the rest in lowercase. Choosing the right style depends on your editorial guide: Title Case suits titles and buttons, whereas Sentence case feels natural for body copy, descriptions, and conversational UI labels.",
  },
  {
    question: "Can you switch between uppercase and lowercase without losing your draft?",
    answer:
      "Yes, you can move freely between uppercase and lowercase while keeping your draft safe thanks to built-in undo history and automatic browser storage. Whenever you convert text, paste new content, or clear the editor, previous states are pushed onto an undo stack so you can step back if a transformation is not what you expected. Your current text, active mode, and live conversion toggle are also saved in local storage for convenience. Still, for sensitive or irreplaceable long-form drafts, keeping a separate backup copy is always a smart habit.",
  },
  {
    question: "Why use alternating or inverse letter styling for social media posts?",
    answer:
      "Alternating and inverse letter styles help captions, comments, and playful messages stand out in crowded social feeds where standard text blends together. Alternating case shifts letters back and forth in a rhythmic pattern, while inverse case flips existing uppercase letters to lowercase and lowercase letters to uppercase. These styles work best for humor, emphasis, or creative banners rather than formal announcements or long articles, since heavy alternation can slow down reading speed. Using them selectively adds personality while keeping your core message easy to spot.",
  },
  {
    question: "How do small caps work and where should you avoid using them?",
    answer:
      "Small caps in this tool map standard Latin letters to compact Unicode small-capital equivalents so the styled text can be copied and pasted across platforms that support Unicode characters. They can add a distinctive visual flair to short labels, usernames, or stylistic accents. However, you should avoid relying on small caps for screen-reader-critical accessibility text, strict search indexing, or exact string matching, because Unicode small-cap characters are distinct code points rather than standard ASCII letters. For formal typography and accessible web documents, native CSS styling or standard text is usually preferable.",
  },
  {
    question: "Does live conversion change text automatically while you type?",
    answer:
      "When the Live Convert switch is turned on, your text is transformed automatically as you type, paste, or select a different conversion mode. This is helpful when you know the exact target style you want and want immediate visual feedback on every word. If you prefer to type freely first and transform everything at once, simply switch Live Convert off and click the Convert button or press Ctrl+Enter (or Cmd+Enter on Mac) whenever you are ready.",
  },
  {
    question: "Is the character, word, and reading time counter accurate for drafts?",
    answer:
      "The statistics panel calculates total characters including spaces, word count by splitting whitespace, approximate sentence count from punctuation marks, and estimated reading time based on an average pace of 3.5 words per second. These metrics update immediately as you edit or convert text, giving you a quick sense of length for meta tags, social posts, scripts, or short articles. Keep in mind that reading speed varies by individual and technical complexity, and unusual punctuation or line breaks can slightly influence sentence estimates.",
  },
  {
    question: "Can mobile users paste, edit, and copy formatted text smoothly?",
    answer:
      "Yes, the editor layout adapts to smaller screens with responsive spacing, touch-friendly buttons, line numbers, and a centered paste button when the input box is empty. You can tap Paste to bring in text from your clipboard, switch between conversion modes, copy the result, or clear the box with a single tap. If your mobile browser restricts automatic clipboard reading due to permission settings, you can still tap inside the editor and use the native paste menu or keyboard shortcuts effortlessly.",
  },
  {
    question: "What keyboard shortcuts make formatting text faster on desktop?",
    answer:
      "On desktop keyboards, pressing Ctrl+Enter or Cmd+Enter triggers text conversion immediately, while pressing Ctrl+Z or Cmd+Z steps backward through your undo history. These shortcuts let you stay on the keyboard while formatting paragraphs, testing different cases, or reverting an unwanted change without reaching for the mouse every time. Combined with the Copy and Clear buttons, they create a fast, streamlined workflow for everyday editing.",
  },
];