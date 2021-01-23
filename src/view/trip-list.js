import AbstractView from "./abstract";

const createEventsListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class TripListView extends AbstractView {
  getTemplate() {
    return createEventsListTemplate();
  }
}
