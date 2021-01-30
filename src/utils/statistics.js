import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const sumPrice = (points) => points.reduce((total, point) => point.price + total, 0);

const getPointDurationInMs = (point) => {
  return dayjs.duration(dayjs(point.dateTo).diff(dayjs(point.dateFrom))).asMilliseconds();
};

const sumPointDurationsInMs = (points) => points.reduce((totalMs, point) =>
  totalMs + getPointDurationInMs(point), 0);

export const getUniqueItems = (items) => [...new Set(items)];

export const getPointTypes = (points) => getUniqueItems(points.map((point) => point.type));

export const sumPriceByType = (points, type) => {
  return sumPrice(points.filter((point) => point.type === type));
};

export const countDurationByPointType = (points, type) => {
  const totalDurationInMs = sumPointDurationsInMs(points.filter((point) => point.type === type));
  return totalDurationInMs;
};
