import AbstractView from "./abstract";

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

export default class TripCostView extends AbstractView {
  constructor(data) {
    super();
    this._pointsData = data;
  }

  getTemplate() {
    return createTripCostTemplate(this._pointsData);
  }
}
