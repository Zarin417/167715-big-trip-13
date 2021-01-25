import dayjs from "dayjs";
import {EVENT_TYPES, EVENT_DESTINATIONS} from "../mock/const";
import {getOffersByType} from "../mock/trip-point";
import SmartView from "./smart";
import flatpickr from "flatpickr";
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

// edit = true - for edit point, false - for new point
const createPointEditTemplate = (pointData, edit) => {
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

    if (offers !== {}) {
      for (let key in offers) {
        if (offers) {
          let checked = ``;

          if (offers[key].checked) {
            checked = `checked`;
          }

          eventOffers += `<div class="event__offer-selector">
                          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offers[key].name}-1" type="checkbox" name="event-offer-${offers[key].name} ${checked}">
                          <label class="event__offer-label" for="event-offer-${offers[key].name}-1">
                            <span class="event__offer-title">${offers[key].description}</span>
                              &plus;&euro;&nbsp;
                            <span class="event__offer-price">${offers[key].price}</span>
                          </label>
                        </div>`;
        }
      }

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
                  <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}">
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

export default class PointEditView extends SmartView {
  constructor(pointData, destinations, isEdit) {
    super();
    this._data = PointEditView.parsePointToData(pointData);
    this._isEdit = isEdit;
    this._destinations = destinations;
    this._datePickerStartDate = null;
    this._datePickerEndDate = null;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
    this._typeOptionsChangeHandler = this._typeOptionsChangeHandler.bind(this);
    this._destinationInputChangeHandler = this._destinationInputChangeHandler.bind(this);
    this._destinationInputFocusHandler = this._destinationInputFocusHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._priceInputChangeHandler = this._priceInputChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickerStartDate();
    this._setDatepickerEndDate();
  }

  removeElement() {
    super.removeElement();

    if (this._datePickerStartDate || this._datePickerEndDate) {
      this._datePickerStartDate.destroy();
      this._datePickerEndDate.destroy();
      this._datePickerStartDate = null;
      this._datePickerEndDate = null;
    }
  }

  getTemplate() {
    return createPointEditTemplate(this._data, this._isEdit);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollupBtnClickHandler(this._callback.rollupBtnClick);
    this._setDatepickerStartDate();
    this._setDatepickerEndDate();
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  reset(point) {
    this.updateData(point);
  }

  setRollupBtnClickHandler(callback) {
    this._callback.rollupBtnClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupBtnClickHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`change`, this._typeOptionsChangeHandler);

    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationInputChangeHandler);

    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`focus`, this._destinationInputFocusHandler);

    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceInputChangeHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
  }

  _rollupBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupBtnClick();
  }

  _typeOptionsChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: getOffersByType(evt.target.value)
    });
  }

  _destinationInputChangeHandler(evt) {
    const destination = this._destinations[evt.target.value];

    this.updateData({
      destination: destination.name,
      description: destination.description,
      photos: destination.photos
    });
  }

  _destinationInputFocusHandler(evt) {
    evt.target.value = ``;
  }

  _setDatepickerStartDate() {
    if (this._datePickerStartDate) {
      this._datePickerStartDate.destroy();
      this._datePickerStartDate = null;
    }

    this._datePickerStartDate = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          enableTime: true,
          time24hr: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.startTime,
          onChange: this._startDateChangeHandler
        }
    );
  }

  _setDatepickerEndDate() {
    if (this._datePickerEndDate) {
      this._datePickerEndDate.destroy();
      this._datePickerEndDate = null;
    }

    this._datePickerEndDate = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          time24hr: true,
          minDate: this._data.startTime,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.endTime,
          onChange: this._endDateChangeHandler
        }
    );
  }

  _startDateChangeHandler(userDate) {
    if (dayjs(userDate).toDate() > dayjs(this._datePickerEndDate.selectedDates).toDate()) {
      this.updateData({
        startTime: dayjs(userDate).toDate(),
        endTime: dayjs(userDate).toDate()
      });
    } else {
      this.updateData({
        date: dayjs(userDate).toDate(),
        startTime: dayjs(userDate).toDate()
      });
    }
  }

  _endDateChangeHandler(userDate) {
    this.updateData({
      endTime: dayjs(userDate).toDate()
    });
  }

  _priceInputChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value
    }, true);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(PointEditView.parseDataToPoint(this._data));
  }

  static parsePointToData(pointData) {
    return Object.assign({}, pointData, {});
  }

  static parseDataToPoint(data) {
    let pointData = Object.assign({}, data);

    return pointData;
  }
}
