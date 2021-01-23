import dayjs from "dayjs";
import {nanoid} from "nanoid";
import {getRandomInteger} from "../utils/common";
import {EVENT_TYPES} from "./const";

const generateRandomPointType = () => {
  const randomIndex = getRandomInteger(0, EVENT_TYPES.length - 1);

  return EVENT_TYPES[randomIndex];
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

const generatePrice = () => {
  const MIN_PRICE = 2;
  const MAX_PRICE = 60;
  const PRICE_MULTIPLICITY = 10;

  return getRandomInteger(MIN_PRICE, MAX_PRICE) * PRICE_MULTIPLICITY;
};

export const destinations = {
  Amsterdam: {
    name: `Amsterdam`,
    description: generateRandomDescription(),
    photos: generateRandomPhotos()
  },
  Chamonix: {
    name: `Chamonix`,
    description: generateRandomDescription(),
    photos: generateRandomPhotos()
  },
  Geneva: {
    name: `Geneva`,
    description: generateRandomDescription(),
    photos: generateRandomPhotos()
  },
  Kyiv: {
    name: `Kyiv`,
    description: generateRandomDescription(),
    photos: generateRandomPhotos()
  },
  Stambul: {
    name: `Stambul`,
    description: generateRandomDescription(),
    photos: generateRandomPhotos()
  }
};

const getRandomDestination = (obj) => {
  const keys = Object.keys(obj);
  return obj[keys[getRandomInteger(0, keys.length - 1)]];
};

export const offers = {
  luggage: {
    name: `luggage`,
    description: `Add luggage`,
    category: [`taxi`, `bus`, `train`, `ship`, `flight`],
    price: 50,
    checked: Boolean(getRandomInteger())
  },
  uber: {
    name: `uber`,
    description: `Order Uber`,
    category: [`taxi`, `transport`],
    price: 20,
    checked: Boolean(getRandomInteger())
  },
  comfort: {
    name: `comfort`,
    description: `Switch to comfort`,
    category: [`taxi`, `bus`, `train`, `ship`, `flight`, `check-in`],
    price: 80,
    checked: Boolean(getRandomInteger())
  },
  car: {
    name: `car`,
    description: `Rent a car`,
    category: [`transport`, `drive`],
    price: 200,
    checked: Boolean(getRandomInteger())
  },
  breakfast: {
    name: `breakfast`,
    description: `Add breakfast`,
    category: [`train`, `ship`, `flight`, `check-in`, `restaurant`],
    price: 50,
    checked: Boolean(getRandomInteger())
  },
  tickets: {
    name: `tickets`,
    description: `Book tickets`,
    category: [`sightseeing`],
    price: 40,
    checked: Boolean(getRandomInteger())
  },
  lunch: {
    name: `lunch`,
    description: `Lunch in city`,
    category: [`train`, `ship`, `flight`, `check-in`, `restaurant`],
    price: 30,
    checked: Boolean(getRandomInteger())
  },
  meal: {
    name: `meal`,
    description: `Add meal`,
    category: [`check-in`, `sightseeing`, `restaurant`],
    price: 15,
    checked: Boolean(getRandomInteger())
  },
  seats: {
    name: `seats`,
    description: `Choose seats`,
    category: [`bus`, `train`, `ship`, `flight`, `check-in`, `sightseeing`, `restaurant`],
    price: 5,
    checked: Boolean(getRandomInteger())
  },
  train: {
    name: `train`,
    description: `Travel by train`,
    category: [`transport`],
    price: 40,
    checked: Boolean(getRandomInteger())
  }
};

export const getOffersByType = (type) => {
  const offersByType = {};
  for (const [offerType, offerInfo] of Object.entries(offers)) {
    if (offerInfo.category.includes(type.toLowerCase())) {
      offersByType[offerType] = offerInfo;
    }
  }
  return offersByType;
};

export const generatePoint = () => {
  const type = generateRandomPointType();
  const destination = getRandomDestination(destinations);
  const date = generateDate();

  return {
    id: nanoid(),
    date,
    type,
    destination: destination.name,
    description: destination.description,
    photos: destination.photos,
    startTime: date,
    endTime: generateEndTime(date),
    price: generatePrice(),
    isFavorite: Boolean(getRandomInteger()),
    offers: getOffersByType(type)
  };
};
