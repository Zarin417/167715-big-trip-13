import {createElement} from "../utils";

const createEmptyEventsListTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class EmptyEventsListView {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEmptyEventsListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
