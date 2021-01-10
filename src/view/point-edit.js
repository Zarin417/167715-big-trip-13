import dayjs from "dayjs";
import {EVENT_TYPES, EVENT_DESTINATIONS} from "../mock/const";
import AbstractView from "./abstract";

// edit = true - for edit point, false - for new point
const createPointTemplate = (pointData, edit) => {
  const {type, destination, startTime, endTime, price, offers, description, photos} = pointData;
  const isEdit = edit;

  const addEventTypeList = () => {
    let typeOptions = ``;

    EVENT_TYPES.forEach((eventType) =>{
      const checked = (eventType === type) ? `checked` : ``;
      typeOptions += `<div class="event__type-item">
                        <input id="event-type-${eventType.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType.toLowerCase()}" ${checked}>
                        <label class="event__type-label  event__type-label--${eventType.toLowerCase()}" for="event-type-${eventType.toLowerCase()}-1">${eventType}</label>
                      </div>`;
    });

    return typeOptions;
  };

  const addDestinationOptions = () => {
    let destinationOptionsList = ``;

    EVENT_DESTINATIONS.forEach((destinationItem) => {
      destinationOptionsList += `<option value="${destinationItem}"></option>`;
    });

    return destinationOptionsList;
  };

  const addButtons = () => {
    if (isEdit) {
      return `<button class="event__reset-btn" type="reset">Delete</button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>`;
    } else {
      return `<button class="event__reset-btn" type="reset">Cancel</button>`;
    }
  };

  const addEventOffers = () => {
    let eventOffers = ``;

    if (offers.length !== 0) {
      offers.forEach((offer) => {
        eventOffers += `<div class="event__offer-selector">
                          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name}-1" type="checkbox" name="event-offer-${offer.name}">
                          <label class="event__offer-label" for="event-offer-${offer.name}-1">
                            <span class="event__offer-title">${offer.description}</span>
                              &plus;&euro;&nbsp;
                            <span class="event__offer-price">${offer.price}</span>
                          </label>
                        </div>`;
      });

      return `<section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                <div class="event__available-offers">
                  ${eventOffers}
                </div>
            </section>`;
    }

    return eventOffers;
  };

  const addDestinationInfo = () => {
    let photosList = ``;

    photos.forEach((photo) => {
      photosList += `<img class="event__photo" src="${photo}" alt="Event photo">`;
    });

    return `<section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${description}</p>
              <div class="event__photos-container">
                <div class="event__photos-tape">
                  ${photosList}
                </div>
              </div>
            </section>`;
  };

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                      ${addEventTypeList()}
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${type}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
                  <datalist id="destination-list-1">
                    ${addDestinationOptions()}
                  </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(startTime).format(`YY/MM/DD h:mm`)}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(endTime).format(`YY/MM/DD h:mm`)}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                ${addButtons()}
              </header>

              <section class="event__details">
                ${addEventOffers()}
                ${addDestinationInfo()}
              </section>
            </form>
          </li>`;
};

export default class PointEditView extends AbstractView {
  constructor(data, edit) {
    super();
    this._pointData = data;
    this._isEdit = edit;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._pointData, this._isEdit);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._pointData);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  _rollupBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupBtnClick();
  }

  setRollupBtnClickHandler(callback) {
    this._callback.rollupBtnClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupBtnClickHandler);
  }
}
