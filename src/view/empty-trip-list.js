import AbstractView from "./abstract";

const createEmptyEventsListTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class EmptyTripListView extends AbstractView {
  getTemplate() {
    return createEmptyEventsListTemplate();
  }
}
