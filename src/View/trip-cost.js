import {createElement} from "../utils";

const createTripCostTemplate = (pointsData) => {

  const addTripCost = () => {
    let tripCost = 0;

    for (let point of pointsData) {
      tripCost += point.price;

      for (let offer of point.offers) {
        tripCost += offer.price;
      }
    }

    return tripCost;
  };

  return `<p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">${addTripCost()}</span>
         </p>`;
};

export default class TripCostView {
  constructor(data) {
    this._pointsData = data;
    this._element = null;
  }

  getTemplate() {
    return createTripCostTemplate(this._pointsData);
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
