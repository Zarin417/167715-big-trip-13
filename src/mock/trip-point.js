import dayjs from "dayjs";
import {getRandomInteger} from "../Utils/common";
import {EVENT_TYPES, EVENT_DESTINATIONS, OFFERS} from "./const";

const generateRandomPointType = () => {
  const randomIndex = getRandomInteger(0, EVENT_TYPES.length - 1);

  return EVENT_TYPES[randomIndex];
};

const generateRandomPointDestination = () => {
  const randomIndex = getRandomInteger(0, EVENT_DESTINATIONS.length - 1);

  return EVENT_DESTINATIONS[randomIndex];
};

const generateRandomDescription = () => {
  const MIN_STRINGS = 1;
  const MAX_STRINGS = 5;
  const textTemplate = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;
  const descriptionStringsAmount = getRandomInteger(MIN_STRINGS, MAX_STRINGS);
  const strings = textTemplate.split(`. `);

  for (let i = strings.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));

    [strings[i], strings[j]] = [strings[j], strings[i]];
  }

  return (descriptionStringsAmount > 1)
    ? `${strings.slice(0, descriptionStringsAmount).join(`. `)}.`
    : `${strings.slice(0, MIN_STRINGS)}.`;
};

const generateRandomPhotos = () => {
  const MIN_PHOTOS = 1;
  const MAX_PHOTOS = 5;
  const URL_MAX_PHOTO_NUMBER = 100;
  const photoUrlTemplate = `http://picsum.photos/248/152?r=`;
  let photos = [];

  const photosAmount = getRandomInteger(MIN_PHOTOS, MAX_PHOTOS);

  for (let i = 0; i < photosAmount; i++) {
    photos.push(photoUrlTemplate + getRandomInteger(MIN_PHOTOS, URL_MAX_PHOTO_NUMBER));
  }

  return photos;
};

const generateDate = () => {
  const MIN_DAYS_GAP = 3;
  const MAX_DAYS_GAP = 14;
  const daysGap = getRandomInteger(MIN_DAYS_GAP, MAX_DAYS_GAP);
  const MIN_HOURS_GAP = 0;
  const MAX_HOURS_GAP = 20;
  const hoursGap = getRandomInteger(MIN_HOURS_GAP, MAX_HOURS_GAP);
  const MIN_MINUTES_GAP = 1;
  const MAX_MINUTES_GAP = 11;
  const MINUTES_MULTIPLICITY = 5;
  const minutesGap = getRandomInteger(MIN_MINUTES_GAP, MAX_MINUTES_GAP) * MINUTES_MULTIPLICITY;

  return dayjs().add(daysGap, `day`).startOf(`day`).add(hoursGap, `hour`).add(minutesGap, `minute`).toDate();
};

const generateEndTime = (date) => {
  const MIN_MINUTES_GAP = 3;
  const MAX_MINUTES_GAP = 30;
  const MINUTES_MULTIPLICITY = 5;
  const minutesGap = getRandomInteger(MIN_MINUTES_GAP, MAX_MINUTES_GAP) * MINUTES_MULTIPLICITY;

  return dayjs(date).add(minutesGap, `minute`).toDate();
};

const generateRandomOffers = () => {
  const MIN_OFFERS = 0;
  const MAX_OFFERS = 5;
  const offersAmount = getRandomInteger(MIN_OFFERS, MAX_OFFERS);
  let offers = [];

  if (offersAmount) {
    for (let i = 0; i < offersAmount;) {
      const randomIndex = getRandomInteger(MIN_OFFERS, OFFERS.length - 1);

      if (!offers.includes(OFFERS[randomIndex])) {
        offers.push(OFFERS[randomIndex]);
        i++;
      }
    }
  }

  return offers;
};

const generatePrice = () => {
  const MIN_PRICE = 2;
  const MAX_PRICE = 60;
  const PRICE_MULTIPLICITY = 10;

  return getRandomInteger(MIN_PRICE, MAX_PRICE) * PRICE_MULTIPLICITY;
};

export const generatePoint = () => {
  const date = generateDate();

  return {
    date,
    type: generateRandomPointType(),
    destination: generateRandomPointDestination(),
    description: generateRandomDescription(),
    photos: generateRandomPhotos(),
    startTime: date,
    endTime: generateEndTime(date),
    price: generatePrice(),
    isFavorite: Boolean(getRandomInteger()),
    offers: generateRandomOffers()
  };
};
