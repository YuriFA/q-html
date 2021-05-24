import Accordion from 'accordion-js';

import { DOMReady } from './utils/DOMReady';
import { InputAutocomplete } from './lib/autocomplete';
import { StepForm, CLASSES as STEP_FORM_CLASSES } from './lib/step-form';

DOMReady(() => {
  const faqQuestions = Array.from(document.querySelectorAll('.faq-questions'));
  if (faqQuestions.length > 0) {
    new Accordion(faqQuestions, {
      duration: 400,
      elementClass: 'faq-questions__item',
      triggerClass: 'faq-questions__title',
      panelClass: 'faq-questions__panel',
      openOnInit: [0],
      showMultiple: true,
    });
  }

  const addressInput = document.querySelectorAll(
    'input.step-form-address__input',
  );
  if (addressInput.length > 0) {
    // Array.from(addressInput).forEach(input => {
    //   new InputAutocomplete(input);
    // });
  }

  const stepForm = Array.from(
    document.querySelectorAll(`.${STEP_FORM_CLASSES.CONTAINER}`),
  );
  console.log({ stepForm });
  if (stepForm.length > 0) {
    stepForm.forEach(element => {
      const form = new StepForm(element);

      element
        .querySelector('.step-form-start')
        .addEventListener('click', () => {
          form.nextStep();
        });

      window.nextStep = form.nextStep;
    });
  }
});
