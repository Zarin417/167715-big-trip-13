export const createTripCostTemplate = (data) => {

  const addTripCost = () => {
    let tripCost = 0;

    for (let point of data) {
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
