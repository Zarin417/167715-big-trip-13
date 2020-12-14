import dayjs from "dayjs";
import {createElement} from "../utils";

const createEventItemTemplate = (data) => {
  const {date, type, destination, startTime, endTime, price, isFavorite, offers} = data;

  const getEventTimeDuration = () => {
    const MINUTES_IN_HOUR = 60;
    const MINUTES_IN_DAY = 1440;
    const durationInMinutes = dayjs(endTime).diff(dayjs(startTime), `minute`);
    let durationDays;
    let durationHours;
    let durationMinutes;

    if (durationInMinutes >= MINUTES_IN_DAY) {
      durationDays = Math.floor(durationInMinutes / MINUTES_IN_DAY);
      durationHours = Math.floor((durationInMinutes % MINUTES_IN_DAY) / MINUTES_IN_HOUR);
      durationMinutes = durationInMinutes % MINUTES_IN_HOUR;
    } else if (durationInMinutes >= MINUTES_IN_HOUR && durationInMinutes < MINUTES_IN_DAY) {
      durationHours = Math.floor(durationInMinutes / MINUTES_IN_HOUR);
      durationMinutes = durationInMinutes % MINUTES_IN_HOUR;
    } else {
      durationMinutes = durationInMinutes;
    }

    durationMinutes = (durationMinutes < 10) ? `0${durationMinutes}M` : `${durationMinutes}M`;

    if (durationDays) {
      durationDays = (durationDays < 10) ? `0${durationDays}D` : `${durationDays}D`;
      durationHours = (durationHours < 10) ? `0${durationHours}H` : `${durationHours}H`;
      return `${durationDays} ${durationHours} ${durationMinutes}`;
    } else if (durationHours) {
      durationHours = (durationHours < 10) ? `0${durationHours}H` : `${durationHours}H`;
      return `${durationHours} ${durationMinutes}`;
    }

    return durationMinutes;
  };

  const favoriteClassName = isFavorite ? `event__favorite-btn--active` : ``;

  const renderOffers = () => {
    if (offers !== []) {
      let offersItems = ``;

      offers.forEach((offer) => {
        offersItems += `<li class="event__offer">
                        <span class="event__offer-title">${offer.description}</span>
                        &plus;&euro;&nbsp;
                        <span class="event__offer-price">${offer.price}</span>
                    </li>`;
      });

      return `<h4 class="visually-hidden">Offers:</h4>
              <ul class="event__selected-offers">
                ${offersItems}
              </ul>`;
    }

    return ``;
  };

  return `<li class="trip-events__item">
            <div class="event">
              <time class="event__date" datetime="${dayjs(date).format(`YYYY-MM-D`)}">${dayjs(date).format(`MMM D`)}</time>
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${type} ${destination}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  <time class="event__start-time" datetime="${dayjs(startTime).format(`YYYY-MM-DTh:mm`)}">${dayjs(startTime).format(`h:mm`)}</time>
                  &mdash;
                  <time class="event__end-time" datetime="${dayjs(endTime).format(`YYYY-MM-DTh:mm`)}">${dayjs(endTime).format(`h:mm`)}</time>
                </p>
                <p class="event__duration">${getEventTimeDuration()}</p>
              </div>
              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${price}</span>
              </p>
              ${renderOffers()}
              <button class="event__favorite-btn ${favoriteClassName}" type="button">
                <span class="visually-hidden">Add to favorite</span>
                <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                  <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                </svg>
              </button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div>
          </li>`;
};

export default class EventItemView {
  constructor(data) {
    this._pointData = data;
    this._element = null;
  }

  getTemplate() {
    return createEventItemTemplate(this._pointData);
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
