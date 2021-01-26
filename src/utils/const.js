import {nanoid} from "nanoid";
import {EVENT_TYPES} from "../mock/const";
import {getOffersByType} from "../mock/trip-point";
import dayjs from "dayjs";

export const BLANK_POINT = {
  id: nanoid(),
  date: dayjs(),
  type: EVENT_TYPES[0],
  destination: `Select destination point`,
  description: ``,
  photos: [],
  startTime: dayjs().toDate(),
  endTime: dayjs().toDate(),
  price: 0,
  isFavorite: false,
  offers: getOffersByType(EVENT_TYPES[0])
};

export const SortType = {
  DEFAULT: `day`,
  TIME: `time`,
  PRICE: `price`
};

export const UserActions = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`
};
