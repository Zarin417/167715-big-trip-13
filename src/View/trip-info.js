import dayjs from "dayjs";

export const createTripInfoTemplate = (data) => {

  const addTripRout = () => {
    const destinations = data.map((point) => {
      return point.destination;
    });

    const tripRout = destinations.filter((element, index) => {
      return element !== destinations[index - 1];
    });

    return tripRout.join(` &mdash; `);
  };

  const addTripPeriod = () => {
    let tripPeriod = ``;
    const startDay = dayjs(data[0].startTime).format(`MMM DD`);
    const endDay = dayjs(data[data.length - 1].endTime).format(`MMM DD`);

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
