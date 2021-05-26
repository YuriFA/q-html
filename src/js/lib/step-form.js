import anime from 'animejs';
import smoothscroll from 'smoothscroll-polyfill';

import { getElementPosition } from '../utils/isScrolledIntoView';

smoothscroll.polyfill();

export const CLASSES = {
  CONTAINER: 'step-form',
  STEP: 'step-form__step',
  STEP_FULLFILLED: 'step-form__step--fullfilled',
  STEP_DONE: 'step-form__step--done',
  SUCCESS_STEP: 'step-form__success',
  ERROR_STEP: 'step-form__error',
  REFRESH_BUTTON: 'step-form__refresh',
};

const DEFAULT_DURATION = 400;
const OUT_DEFAULT_DURATION = 100;

const DEFAULT_ANIMATION_PROPS = {
  duration: DEFAULT_DURATION,
  easing: 'cubicBezier(.5, .05, .1, .3)', // 'spring(2, 70, 50, 1)', // 'easeInOutQuad',
};

export class StepForm {
  constructor(container, { onSubmit }) {
    this.container = container;

    this.currentStep = 0;
    this.onSubmit = onSubmit;
    this.init();
  }

  init() {
    this.successStep = {
      element: this.container.querySelector(`.${CLASSES.SUCCESS_STEP}`),
      animation: {
        in: { opacity: { value: 1 }, zIndex: { value: 2 } },
        out: { opacity: { value: 0 }, zIndex: { value: 1 } },
      },
    };
    this.errorStep = {
      element: this.container.querySelector(`.${CLASSES.ERROR_STEP}`),
      animation: {
        in: { opacity: { value: 1 }, zIndex: { value: 2 } },
        out: { opacity: { value: 0 }, zIndex: { value: 1 } },
      },
    };

    this.steps = Array.from(
      this.container.querySelectorAll(`.${CLASSES.STEP}`),
    ).map((element, index) => {
      let animation = {};
      switch (index) {
        case 0:
          animation = {
            in: { opacity: { value: 1 } },
            out: { opacity: { value: 0 } },
          };
          break;

        case 2:
          animation = {
            in: { opacity: { value: 1 }, translateY: { value: [100, 0] } },
            out: {
              opacity: { value: 0 },
              translateY: { value: [0, 100] },
              visibility: { value: 'hidden' },
            },
          };
          break;

        case 1:
          animation = {
            in: {
              opacity: { value: 1 },
              maxWidth: { value: '100%', delay: 200 },
            },
            out: {
              opacity: { value: 0 },
              maxWidth: { value: null },
              visibility: { value: 'hidden' },
            },
          };
          break;

        case 3:
        case 4:
        case 5:
          animation = {
            in: {
              opacity: { value: 1 },
              zIndex: { value: 2 },
              translateY: { value: [100, 0] },
            },
            out: {
              opacity: { value: 0, duration: OUT_DEFAULT_DURATION },
              zIndex: { value: 1, duration: OUT_DEFAULT_DURATION },
              translateY: { value: [0, 100] },
              visibility: { value: 'hidden' },
            },
          };

        default:
          break;
      }

      return { element, animation };
    });

    this.refreshForm();
    // this.setStep(3);

    ['input', 'change'].map(event => {
      this.container.addEventListener(event, () => {
        for (let i = 0; i <= this.currentStep; i++) {
          const isValid = this.validateStep(i);
          this.visualizeStepFullfilled(i, isValid);
        }
      });
    });

    const nextTriggers = Array.from(
      this.container.querySelectorAll('[data-form-next]'),
    );
    nextTriggers.forEach(element => {
      element.addEventListener('click', event => {
        const stepContainer = event.target.closest(`.${CLASSES.STEP}`);
        const stepIndex = this.steps.findIndex(
          step => step.element === stepContainer,
        );

        if (stepIndex >= this.steps.length) {
          return;
        }

        this.setStep(stepIndex + 1);
      });
    });

    const backTriggers = Array.from(
      this.container.querySelectorAll('[data-form-back]'),
    );
    backTriggers.forEach(element => {
      element.addEventListener('click', event => {
        const stepContainer = event.target.closest(`.${CLASSES.STEP}`);
        const stepIndex = this.steps.findIndex(
          step => step.element === stepContainer,
        );

        if (stepIndex <= 0) {
          return;
        }

        this.setStep(stepIndex - 1);
      });
    });

    const editTriggers = Array.from(
      this.container.querySelectorAll('[data-form-edit]'),
    );
    editTriggers.forEach(element => {
      element.addEventListener('click', event => {
        const stepContainer = event.target.closest(`.${CLASSES.STEP}`);
        const stepIndex = this.steps.findIndex(
          step => step.element === stepContainer,
        );

        if (stepIndex <= 0) {
          return;
        }

        this.setStep(stepIndex);
      });
    });

    this.container.addEventListener('submit', async event => {
      event.preventDefault();

      try {
        const values = new FormData(this.container);
        const res = await this.onSubmit(values);
        console.log({ res });
        this.showSuccessStep();
      } catch (error) {
        console.log({ error });
        this.showErrorStep();
      }
    });

    const refreshButtons = Array.from(
      this.container.querySelectorAll(`.${CLASSES.REFRESH_BUTTON}`),
    );
    if (refreshButtons) {
      refreshButtons.forEach(element => {
        element.addEventListener('click', () => {
          this.refreshForm(1, { scrollIntoView: true });
        });
      });
    }
  }

  validateStep = step => {
    let validationResult = false;
    const formValues = new FormData(this.container);

    switch (step) {
      case 0:
      case 4:
      case 5:
        validationResult = true;
        break;

      case 1:
        const address = formValues.get('address');
        validationResult = address.length > 0;
        break;

      case 2:
        const name = formValues.get('name');
        const email = formValues.get('email');
        const phone = formValues.get('phone');

        validationResult =
          name.length > 0 && email.length > 0 && phone.length > 0;
        break;

      case 3:
        const type = formValues.get('type');

        validationResult = type && type.length > 0;
        break;

      default:
        validationResult = false;
        break;
    }

    return validationResult;
  };

  visualizeStepFullfilled = (step, isValid) => {
    const stepContainer = this.steps[step].element;
    stepContainer.classList.toggle(CLASSES.STEP_FULLFILLED, isValid);

    const nextButton = stepContainer.querySelector('[data-form-next]');
    if (nextButton) {
      nextButton.disabled = !isValid;
    }
  };

  setStep = (step, { scrollIntoView } = { scrollIntoView: true }) => {
    console.log('SET STEP', { step });

    this.toggleStepsVisibility(step);
    this.stepAnimation(step);

    const isValid = this.validateStep(step);
    this.visualizeStepFullfilled(step, isValid);
    this.setDonePreviousSteps(step);

    if (scrollIntoView) {
      this.scrollIntoView(step);
    }

    this.currentStep = step;
  };

  scrollIntoView = step => {
    const stepContainer = this.steps[step];

    const {
      elemBottom,
      docViewBottom,
      elemTop,
      docViewTop,
    } = getElementPosition(stepContainer.element);

    const isScrolledIntoView =
      elemBottom <= docViewBottom && elemTop >= docViewTop;

    if (isScrolledIntoView) {
      return;
    }

    window.scroll({
      top: elemTop - (elemBottom - elemTop) / 2 - window.innerHeight / 4,
      left: 0,
      behavior: 'smooth',
    });

    // stepContainer.element.scrollIntoView({
    //   block: 'center',
    //   behavior: 'smooth',
    // });
  };

  setAnimationStyles = (stepContainer, type = 'in') => {
    Object.keys(stepContainer.animation[type]).map(property => {
      stepContainer.element.style[property] =
        stepContainer.animation[type][property].value;
    });
  };

  toggleStepsVisibility = step => {
    this.steps.map((stepContainer, index) => {
      if (!stepContainer) {
        return;
      }

      if (step > index) {
        // if (index === 0 && step - index > 1) {
        if (index === 0) {
          return;
        }

        if (index >= 3) {
          return;
        }

        this.setAnimationStyles(stepContainer, 'in');
      } else if (step < index) {
        this.visualizeStepFullfilled(index, false);
        this.setAnimationStyles(stepContainer, 'out');
      }
    });

    this.setAnimationStyles(this.successStep, 'out');
    this.setAnimationStyles(this.errorStep, 'out');
  };

  setDonePreviousSteps = step => {
    this.steps.map((stepContainer, index) => {
      if (stepContainer) {
        stepContainer.element.classList.toggle(CLASSES.STEP_DONE, index < step);
      }
    });
  };

  stepAnimation = step => {
    const prevStep = this.steps[this.currentStep]; // this.steps[step - 1];
    const nextStep = this.steps[step];

    const isIgnorePrevAnimation =
      this.currentStep < step && [1, 2].includes(this.currentStep);

    if (!isIgnorePrevAnimation && prevStep && prevStep.animation) {
      anime({
        targets: prevStep.element,
        ...DEFAULT_ANIMATION_PROPS,
        ...prevStep.animation.out,
      });
    }

    nextStep.element.style.visibility = '';
    anime({
      targets: nextStep.element,
      ...DEFAULT_ANIMATION_PROPS,
      ...nextStep.animation.in,
    });
  };

  showSuccessStep = () => {
    const prevStep = this.steps[this.currentStep];
    const nextStep = this.successStep;

    anime({
      targets: prevStep.element,
      ...DEFAULT_ANIMATION_PROPS,
      ...prevStep.animation.out,
    });
    anime({
      targets: nextStep.element,
      ...DEFAULT_ANIMATION_PROPS,
      ...nextStep.animation.in,
    });
  };

  showErrorStep = () => {
    const prevStep = this.steps[this.currentStep];
    const nextStep = this.errorStep;

    anime({
      targets: prevStep.element,
      ...DEFAULT_ANIMATION_PROPS,
      ...prevStep.animation.out,
    });
    anime({
      targets: nextStep.element,
      ...DEFAULT_ANIMATION_PROPS,
      ...nextStep.animation.in,
    });
  };

  refreshForm = (step = 0, options = { scrollIntoView: false }) => {
    this.setStep(step, options);
    this.container.reset();
  };
}
