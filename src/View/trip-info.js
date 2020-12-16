import dayjs from "dayjs";
import {createElement} from "../utils";

const createTripInfoTemplate = (pointsData) => {

  const addTripRout = () => {
    const destinations = pointsData.map((point) => {
      return point.destination;
    });

    let tripRout = [];

    if (destinations.length === 1) {
      return tripRout.push(destinations[0]);
    } else {
      tripRout.push(destinations[0]);
      tripRout.push(destinations[destinations.length - 1]);
      return tripRout.join(` &mdash; `);
    }
  };

  const addTripPeriod = () => {
    let tripPeriod = ``;
    const startDay = dayjs(pointsData[0].startTime).format(`MMM DD`);
    const endDay = dayjs(pointsData[pointsData.length - 1].endTime).format(`MMM DD`);

    if (startDay.slice(0, 4) !== endDay.slice(0, 4)) {
      tripPeriod = `${startDay} &mdash; ${endDay}`;
    } else {
      tripPeriod = `${startDay} &mdash; ${endDay.slice(4)}`;
    }

    return tripPeriod;
  };

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${addTripRout()}</h1>

              <p class="trip-info__dates">${addTripPeriod()}</p>
            </div>
          </section>`;
};

export default class TripInfoView {
  constructor(data) {
    this._pointsData = data;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._pointsData);
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
