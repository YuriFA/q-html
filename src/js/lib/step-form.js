import anime from 'animejs';

export const CLASSES = {
  CONTAINER: 'step-form',
  STEP: 'step-form__step',
  STEP_FULLFILLED: 'step-form__step--fullfilled',
  STEP_DONE: 'step-form__step--done',
  SUCCESS_STEP: 'step-form__success',
  ERROR_STEP: 'step-form__error',
  REFRESH_BUTTON: 'step-form__refresh',
};

const DEFAULT_ANIMATION_PROPS = {
  duration: 200,
  easing: 'easeInOutQuad',
};

export class StepForm {
  constructor(container, { onSubmit }) {
    this.container = container;

    this.currentStep = 0;
    this.successStep = this.container.querySelector(`.${CLASSES.SUCCESS_STEP}`);
    this.errorStep = this.container.querySelector(`.${CLASSES.ERROR_STEP}`);
    this.onSubmit = onSubmit;
    this.init();
  }

  init() {
    this.steps = Array.from(
      this.container.querySelectorAll(`.${CLASSES.STEP}`),
    );

    this.refreshForm();
    // this.setStep(0);

    ['input', 'change'].map(event => {
      this.container.addEventListener(event, () => {
        for (let i = 0; i <= this.currentStep; i++) {
          const isValid = this.validateStep(i);
          this.visualizeStepFullfilled(i, isValid);
        }
      });
    });

    const nextTriggers = Array.from(
      this.container.querySelectorAll(
        '.step-form-start, .step-form__next, .step-form__see',
      ),
    );

    nextTriggers.forEach(element => {
      element.addEventListener('click', event => {
        const stepContainer = event.target.closest(`.${CLASSES.STEP}`);
        const stepIndex = this.steps.findIndex(
          element => element === stepContainer,
        );

        console.log({ stepIndex, stepContainer });
        this.setStep(stepIndex + 1);
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
          this.refreshForm();
        });
      });
    }
  }

  validateStep = step => {
    console.log('validateStep', { step });
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
    console.log('visualizeStepFullfilled', { step, isValid });
    const stepContainer = this.steps[step];
    stepContainer.classList.toggle(CLASSES.STEP_FULLFILLED, isValid);

    const nextButton = stepContainer.querySelector('[data-form-next]');
    if (nextButton) {
      nextButton.disabled = !isValid;
    }
  };

  setStep = step => {
    console.log('SET STEP', { step });

    this.toggleStepsVisibility(step);
    this.stepAnimation(step);

    const isValid = this.validateStep(step);
    console.log({ step, isValid });
    this.visualizeStepFullfilled(step, isValid);

    this.setDonePreviousSteps(step);

    this.currentStep = step;
  };

  toggleStepsVisibility = step => {
    this.steps.map((stepContainer, index) => {
      if (!stepContainer) {
        return;
      }

      if (step > index) {
        switch (index) {
          case 2:
          case 3:
          case 4:
          case 5:
            stepContainer.style.opacity = 1;
            break;

          case 1:
            stepContainer.style.opacity = 1;
            stepContainer.style.maxWidth = '100%';
            break;

          default:
            break;
        }
      } else if (step < index) {
        this.visualizeStepFullfilled(index, false);

        switch (index) {
          case 2:
          case 3:
          case 4:
          case 5:
            stepContainer.style.opacity = 0;
            break;

          case 1:
            stepContainer.style.opacity = 0;
            stepContainer.style.maxWidth = '';
            break;

          default:
            break;
        }
      }
    });

    this.successStep.style.opacity = 0;
    this.successStep.style.zIndex = '';

    this.errorStep.style.opacity = 0;
    this.errorStep.style.zIndex = '';
  };

  setDonePreviousSteps = step => {
    this.steps.map((stepContainer, index) => {
      if (stepContainer) {
        if (index < step) {
          stepContainer.classList.add(CLASSES.STEP_DONE);
        } else if (index > step) {
          stepContainer.classList.remove(CLASSES.STEP_DONE);
        }
      }
    });
  };

  stepAnimation = step => {
    const prevStepContainer = this.steps[step - 1];
    const nextStepContainer = this.steps[step];

    switch (step) {
      case 0:
        anime({
          ...DEFAULT_ANIMATION_PROPS,
          targets: nextStepContainer,
          opacity: 1,
        });
        break;
      case 1:
        anime({
          ...DEFAULT_ANIMATION_PROPS,
          targets: prevStepContainer,
          opacity: 0,
        });
        anime({
          ...DEFAULT_ANIMATION_PROPS,
          targets: nextStepContainer,
          opacity: 1,
          maxWidth: { delay: 200, value: '100%', duration: 200 },
        });
        break;

      case 2:
        anime({
          ...DEFAULT_ANIMATION_PROPS,
          targets: nextStepContainer,
          opacity: 1,
        });
        break;

      case 3:
        anime({
          ...DEFAULT_ANIMATION_PROPS,
          targets: nextStepContainer,
          opacity: 1,
          zIndex: 2,
        });
        break;

      case 4:
        anime({
          ...DEFAULT_ANIMATION_PROPS,
          targets: prevStepContainer,
          opacity: 0,
          zIndex: 1,
        });
        anime({
          ...DEFAULT_ANIMATION_PROPS,
          targets: nextStepContainer,
          opacity: 1,
          zIndex: 2,
        });
        break;

      case 5:
        anime({
          ...DEFAULT_ANIMATION_PROPS,
          targets: prevStepContainer,
          opacity: 0,
          zIndex: 1,
        });
        anime({
          ...DEFAULT_ANIMATION_PROPS,
          targets: nextStepContainer,
          opacity: 1,
          zIndex: 2,
        });
        break;

      default:
        break;
    }
  };

  showSuccessStep = () => {
    const prevStepContainer = this.steps[this.currentStep];
    const nextStepContainer = this.successStep;

    anime({
      ...DEFAULT_ANIMATION_PROPS,
      targets: prevStepContainer,
      opacity: 0,
      zIndex: 1,
    });
    anime({
      ...DEFAULT_ANIMATION_PROPS,
      targets: nextStepContainer,
      opacity: 1,
      zIndex: 2,
    });
  };

  showErrorStep = () => {
    const prevStepContainer = this.steps[this.currentStep];
    const nextStepContainer = this.errorStep;

    anime({
      targets: prevStepContainer,
      opacity: 0,
      duration: 300,
      zIndex: 1,
      easing: 'easeInOutQuad',
    });
    anime({
      targets: nextStepContainer,
      opacity: 1,
      duration: 300,
      zIndex: 2,
      easing: 'easeInOutQuad',
    });
  };

  refreshForm = () => {
    this.setStep(0);
    this.container.reset();
  };
}
