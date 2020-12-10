export const createNewPointOffersTemplate = (data) => {
  const {offers} = data;

  const addEventOffer = () => {
    let eventOffers = ``;

    for (let i = 0; i < offers.length; i++) {
      eventOffers += `<div class="event__offer-selector">
                       <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offers[i].name}-1" type="checkbox" name="event-offer-${offers[i].name}">
                       <label class="event__offer-label" for="event-offer-${offers[i].name}-1">
                         <span class="event__offer-title">${offers[i].description}</span>
                           &plus;&euro;&nbsp;
                         <span class="event__offer-price">${offers[i].price}</span>
                       </label>
                     </div>`;
    }

    return eventOffers;
  };

  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${addEventOffer()}
            </div>
          </section>`;
};
