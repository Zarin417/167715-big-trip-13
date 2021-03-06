import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const getDestinationsForTrip = (points) => {
  if (!points || points.length === 0) {
    return null;
  }

  const destinations = points.map((point) => point.destination.name);

  return destinations;
};

export const humanizeDate = (date, formatter = `YYYY-MM-DD`) => {
  return dayjs(date).format(formatter);
};

export const getTripInfo = (points) => {

  if (!points || points.length === 0) {
    return null;
  }

  const pointsByDateAsc = points.slice().sort(sortByDate);

  return {
    dateFrom: pointsByDateAsc[0].dateFrom,
    dateTo: pointsByDateAsc[pointsByDateAsc.length - 1].dateTo,
    destinations: getDestinationsForTrip(pointsByDateAsc)
  };
};

export const getTripPrice = (points) => {
  if (!points || points.length === 0) {
    return 0;
  }

  const totalPriceForPoints = points.reduce((total, point) => {
    const priceForPointOffers = point.offers.reduce((sum, offer) => sum + offer.price, 0);
    return point.price + priceForPointOffers + total;
  }, 0);

  return totalPriceForPoints;
};

export const sortByDate = (lhsPoint, rhsPoint) => {
  return dayjs(lhsPoint.dateFrom).diff(dayjs(rhsPoint.dateFrom));
};

export const sortByTime = (lhsPoint, rhsPoint) => {
  const lhsDurationMs = dayjs.duration(dayjs(lhsPoint.dateTo).diff(dayjs(lhsPoint.dateFrom))).asMilliseconds();
  const rhsDurationMs = dayjs.duration(dayjs(rhsPoint.dateTo).diff(dayjs(rhsPoint.dateFrom))).asMilliseconds();

  return rhsDurationMs - lhsDurationMs;
};

export const sortByPrice = (lhsPoint, rhsPoint) => {
  return rhsPoint.price - lhsPoint.price;
};

export const isPastDate = (date) => {
  return date === null ? false : dayjs().isAfter(date);
};

export const isFutureDate = (date) => {
  return date === null ? false : dayjs().isBefore(date, `day`) || dayjs().isSame(date, `day`);
};

export const formatDuration = (dateFrom, dateTo) => {
  const durationInMs = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));

  return formatDurationMs(durationInMs.asMilliseconds());
};

export const formatDurationMs = (ms) => {
  const durationToFormat = dayjs.duration(ms);
  const days = durationToFormat.days();
  const hours = durationToFormat.hours();
  const minutes = durationToFormat.minutes();
  let template;

  if (days) {
    template = `DD[D] HH[H] mm[M]`;
  } else if (hours) {
    template = `HH[H] mm[M]`;
  } else {
    template = `mm[M]`;
  }

  const durationBeforeFormat = `0000-00-${days} ${hours}:${minutes}`;
  const formattedDuration = dayjs(durationBeforeFormat).format(template);
  return formattedDuration;
};
