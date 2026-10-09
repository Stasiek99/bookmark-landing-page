import heroIllustration from '../assets/images/illustration-hero.svg';
import tab1 from '../assets/images/illustration-features-tab-1.svg';
import tab2 from '../assets/images/illustration-features-tab-2.svg';
import tab3 from '../assets/images/illustration-features-tab-3.svg';
import chrome from '../assets/images/logo-chrome.svg';
import firefox from '../assets/images/logo-firefox.svg';
import opera from '../assets/images/logo-opera.svg';

export const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
] as const;

export const HERO = {
  illustration: heroIllustration,
  title: 'A Simple Bookmark Manager',
  text: 'A clean and simple interface to organize your favourite websites. Open a new browser tab and see your sites load instantly. Try it for free.',
};

export interface FeatureTab {
  id: string;
  label: string;
  title: string;
  text: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
}

export const FEATURES_INTRO = {
  title: 'Features',
  text: 'Our aim is to make it quick and easy for you to access your favourite websites. Your bookmarks sync between your devices so you can access them on the go.',
};

export const FEATURE_TABS: FeatureTab[] = [
  {
    id: 'bookmarking',
    label: 'Simple Bookmarking',
    title: 'Bookmark in one click',
    text: 'Organize your bookmarks however you like. Our simple drag-and-drop interface gives you complete control over how you manage your favourite sites.',
    image: tab1,
    imageWidth: 536,
    imageHeight: 346,
  },
  {
    id: 'searching',
    label: 'Speedy Searching',
    title: 'Intelligent search',
    text: 'Our powerful search feature will help you find saved sites in no time at all. No need to trawl through all of your bookmarks.',
    image: tab2,
    imageWidth: 478,
    imageHeight: 416,
  },
  {
    id: 'sharing',
    label: 'Easy Sharing',
    title: 'Share your bookmarks',
    text: 'Easily share your bookmarks and collections with others. Create a shareable link that you can send at the click of a button.',
    image: tab3,
    imageWidth: 440,
    imageHeight: 380,
  },
];

export const DOWNLOAD_INTRO = {
  title: 'Download the extension',
  text: 'We’ve got more browsers in the pipeline. Please do let us know if you’ve got a favourite you’d like us to prioritize.',
};

export const BROWSERS = [
  { name: 'Chrome', version: 62, logo: chrome, width: 102, height: 100 },
  { name: 'Firefox', version: 55, logo: firefox, width: 105, height: 100 },
  { name: 'Opera', version: 46, logo: opera, width: 96, height: 100 },
] as const;

export const FAQ_INTRO = {
  title: 'Frequently Asked Questions',
  text: 'Here are some of our FAQs. If you have any other questions you’d like answered please feel free to email us.',
};

const FAQ_ANSWER =
  'Vivamus luctus eros aliquet convallis ultricies. Mauris augue massa, ultricies non ligula. Suspendisse imperdiet. Vivamus luctus eros aliquet convallis ultricies. Mauris augue massa, ultricies non ligula. Suspendisse imperdiet tVivamus luctus eros aliquet convallis ultricies. Mauris augue massa, ultricies non ligula. Suspendisse imperdiet.';

export const FAQS = [
  { id: 'what', question: 'What is Bookmark?', answer: FAQ_ANSWER },
  { id: 'browser', question: 'How can I request a new browser?', answer: FAQ_ANSWER },
  { id: 'mobile', question: 'Is there a mobile app?', answer: FAQ_ANSWER },
  { id: 'chromium', question: 'What about other Chromium browsers?', answer: FAQ_ANSWER },
];

export const SOCIAL_LINKS = [
  { id: 'facebook', label: 'Facebook', href: 'https://facebook.com' },
  { id: 'twitter', label: 'Twitter', href: 'https://twitter.com' },
] as const;
