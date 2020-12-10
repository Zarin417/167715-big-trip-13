import {createSiteMenuTemplate} from "./View/site-menu";
import {createSiteFiltersTemplate} from "./View/site-filters";
import {createTripInfoTemplate} from "./View/trip-info";
import {createTripCostTemplate} from "./View/trip-cost";
import {createSortListTemplate} from "./View/sort-list";
import {createTripEventsListTemplate} from "./View/events-list";
import {createTripEventItemTemplate} from "./View/event-item";
// import {createEmptyTripListTemplate} from "./View/empty-events-list";
import {createNewPointTemplate} from "./View/new-point";
import {createNewPointOffersTemplate} from "./View/new-point-offers";
import {createNewPointDestination} from "./View/new-point-destination";
import {renderTemplate, RenderPosition} from "./util";
import {generatePoint} from "./mock/trip-point";

const POINTS_AMOUNT = 20;
const points = new Array(POINTS_AMOUNT).fill(undefined).map(generatePoint).sort((a, b) => {
  return new Date(a.date) - new Date(b.date);
});

const pageHeaderMain = document.querySelector(`.trip-main`);
const pageHeaderNav = pageHeaderMain.querySelector(`.trip-controls`);
const pageHeaderNavMenuTitle = pageHeaderNav.querySelector(`h2:first-child`);

renderTemplate(pageHeaderNavMenuTitle, createSiteMenuTemplate(), RenderPosition.AFTER_END);
renderTemplate(pageHeaderNav, createSiteFiltersTemplate(), RenderPosition.BEFORE_END);
renderTemplate(pageHeaderMain, createTripInfoTemplate(points), RenderPosition.AFTER_BEGIN);

const pageHeaderTripInfo = pageHeaderMain.querySelector(`.trip-info`);

renderTemplate(pageHeaderTripInfo, createTripCostTemplate(points), RenderPosition.BEFORE_END);

const pageMainTripEvents = document.querySelector(`.trip-events`);
const pageMainTripEventsTittle = pageMainTripEvents.querySelector(`h2:first-child`);

renderTemplate(pageMainTripEventsTittle, createSortListTemplate(), RenderPosition.AFTER_END);
renderTemplate(pageMainTripEvents, createTripEventsListTemplate(), RenderPosition.BEFORE_END);

const tripEventsList = pageMainTripEvents.querySelector(`.trip-events__list`);

for (let i = 1; i < POINTS_AMOUNT; i++) {
  renderTemplate(tripEventsList, createTripEventItemTemplate(points[i]), RenderPosition.BEFORE_END);
}

renderTemplate(tripEventsList, createNewPointTemplate(points[0]), RenderPosition.AFTER_BEGIN);

const newTripEventDetails = tripEventsList.querySelector(`.event__details`);

if (points[0].offers.length !== 0) {
  renderTemplate(newTripEventDetails, createNewPointOffersTemplate(points[0]), RenderPosition.AFTER_BEGIN);
}

renderTemplate(newTripEventDetails, createNewPointDestination(points[0]), RenderPosition.BEFORE_END);
