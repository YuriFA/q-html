const OPTIONS = {
  types: ['(cities)'],
  componentRestrictions: { country: 'us' },
  fields: ['name'],
};

export class InputAutocomplete {
  constructor(input) {
    this.input = input;

    this.init();
  }

  init() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.input,
      OPTIONS,
    );

    // this.autocomplete.addListener('place_changed', () => {
    //   const q = this.autocomplete.getPlace();
    // });
  }
}

export class AutocompleteService {
  constructor({ input, popup, onSelect }) {
    this.input = input;
    this.popup = popup;
    this.popupList = this.popup.querySelector('ul');

    this.bindedDisplaySuggestions = this.displaySuggestions.bind(this);

    this.callbacks = {};
    this.callbacks.onSelect = onSelect;

    this.init();
  }

  init() {
    this.service = new google.maps.places.AutocompleteService();

    this.input.addEventListener('input', event => {
      this.getQueryPredictions(event.target.value);
    });
  }

  displaySuggestions(predictions, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
      alert(status);
      return;
    }

    predictions.forEach(prediction => {
      const li = document.createElement('li');
      const spanMain = document.createElement('span');
      spanMain.appendChild(
        document.createTextNode(prediction.structured_formatting.main_text),
      );
      const spanSecondary = document.createElement('span');
      spanSecondary.appendChild(
        document.createTextNode(
          prediction.structured_formatting.secondary_text,
        ),
      );

      li.appendChild(spanMain);
      li.appendChild(document.createTextNode(', '));
      li.appendChild(spanSecondary);
      li.dataset.value = prediction.description;

      li.addEventListener('click', event => {
        this.input.value = event.currentTarget.dataset.value;
        this.callbacks.onSelect();
      });

      this.popupList.appendChild(li);
    });
  }

  getQueryPredictions(value) {
    this.service.getPlacePredictions(
      { input: value, ...OPTIONS },
      this.bindedDisplaySuggestions,
    );
  }
}
