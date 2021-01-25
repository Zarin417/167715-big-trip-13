import dayjs from "dayjs";

export const sortByTime = (pointA, pointB) => {
  const pointADuration = dayjs(pointA.endTime).diff(dayjs(pointA.startTime));
  const pointBDuration = dayjs(pointB.endTime).diff(dayjs(pointB.startTime));

  return pointBDuration - pointADuration;
};

export const sortByPrice = (pointA, pointB) => {
  return pointB.price - pointA.price;
};
