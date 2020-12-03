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

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const pageHeaderMain = document.querySelector(`.trip-main`);
const pageHeaderNav = pageHeaderMain.querySelector(`.trip-controls`);
const pageHeaderNavMenuTitle = pageHeaderNav.querySelector(`h2:first-child`);

render(pageHeaderNavMenuTitle, createSiteMenuTemplate(), `afterend`);
render(pageHeaderNav, createSiteFiltersTemplate(), `beforeend`);
render(pageHeaderMain, createTripInfoTemplate(), `afterbegin`);

const pageHeaderTripInfo = pageHeaderMain.querySelector(`.trip-info`);

render(pageHeaderTripInfo, createTripCostTemplate(), `beforeend`);

const pageMainTripEvents = document.querySelector(`.trip-events`);
const pageMainTripEventsTittle = pageMainTripEvents.querySelector(`h2:first-child`);

render(pageMainTripEventsTittle, createSortListTemplate(), `afterend`);
render(pageMainTripEvents, createTripEventsListTemplate(), `beforeend`);

const tripEventsList = pageMainTripEvents.querySelector(`.trip-events__list`);
let counter = 0;

while (counter < 3) {
  render(tripEventsList, createTripEventItemTemplate(), `beforeend`);
  counter++;
}

render(tripEventsList, createNewPointTemplate(), `afterbegin`);

const newTripEventDetails = tripEventsList.querySelector(`.event__details`);

render(newTripEventDetails, createNewPointOffersTemplate(), `afterbegin`);
render(newTripEventDetails, createNewPointDestination(), `beforeend`);
