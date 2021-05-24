import anime from 'animejs';

export const CLASSES = {
  CONTAINER: 'step-form',
  STEP: 'step-form__step',
};

export class StepForm {
  constructor(container) {
    this.container = container;

    this.init();
  }

  init() {
    this.steps = Array.from(
      this.container.querySelectorAll(`.${CLASSES.STEP}`),
    );

    this.nextStep(0);
  }

  nextStep = step => {
    let nextStep;
    if (step !== undefined) {
      nextStep = step;
    } else {
      nextStep = this.currentStep + 1;
    }

    let currentStepContainer;
    if (nextStep === 0) {
      currentStepContainer = null;
    } else {
      currentStepContainer = this.steps[this.currentStep];
    }

    const nextStepContainer = this.steps[nextStep];

    console.log({ currentStepContainer, nextStepContainer });

    switch (nextStep) {
      case 0:
        anime({
          targets: nextStepContainer,
          opacity: 1,
          duration: 200,
          easing: 'easeInOutQuad',
        });
        break;
      case 1:
        anime({
          targets: currentStepContainer,
          opacity: 0,
          duration: 200,
          easing: 'easeInOutQuad',
        });
        anime({
          targets: nextStepContainer,
          opacity: 1,
          maxWidth: { delay: 200, value: '100%', duration: 200 },
          duration: 300,
          easing: 'easeInOutQuad',
        });
        break;

      case 2:
        anime({
          targets: nextStepContainer,
          opacity: 1,
          duration: 300,
          easing: 'easeInOutQuad',
        });

      default:
        break;
    }

    this.currentStep = nextStep;
  };
}
