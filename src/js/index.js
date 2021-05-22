import Accordion from 'accordion-js';

import { DOMReady } from './utils/DOMReady';

DOMReady(() => {
  const faqQuestions = Array.from(
    document.querySelectorAll('.faq-questions'),
  );
  if (faqQuestions.length > 0) {
    new Accordion(faqQuestions, {
      duration: 300,
      elementClass: 'faq-questions__item',
      triggerClass: 'faq-questions__title',
      panelClass: 'faq-questions__panel',
    });
  }
});
