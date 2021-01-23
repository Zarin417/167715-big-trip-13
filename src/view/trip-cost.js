import AbstractView from "./abstract";

const createTripCostTemplate = (pointsData) => {
  const addTripCost = () => {
    let tripCost = 0;

    for (let point of pointsData) {
      let offers = point.offers;
      tripCost += point.price;

      Object.keys(offers).forEach((key) => {
        if (offers[key].checked) {
          tripCost += offers[key].price;
        }
      });
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
