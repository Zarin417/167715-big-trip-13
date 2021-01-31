import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter.js';
import HeaderPresenter from './presenter/header';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {isOnline} from './utils/common.js';
import {toast} from './utils/toast/toast.js';
import {showOffline, showOnline} from './utils/offline/offline.js';
import {UpdateType, MenuItem, FilterType} from './utils/const.js';
import {remove, render, RenderPosition} from './utils/render.js';

const AUTHORIZATION = `Basic oe456j6l34u83fhh4kf8829`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const STORE_POINTS_PREFIX = `bigtrip-localstorage-points`;
const STORE_POINTS_VER = `v13`;
const STORE_POINTS_NAME = `${STORE_POINTS_PREFIX}-${STORE_POINTS_VER}`;

const STORE_OFFERS_PREFIX = `bigtrip-localstorage-offers`;
const STORE_OFFERS_VER = `v13`;
const STORE_OFFERS_NAME = `${STORE_OFFERS_PREFIX}-${STORE_OFFERS_VER}`;

const STORE_DESTINATIONS_PREFIX = `bigtrip-localstorage-destinations`;
const STORE_DESTINATIONS_VER = `v13`;
const STORE_DESTINATIONS_NAME = `${STORE_DESTINATIONS_PREFIX}-${STORE_DESTINATIONS_VER}`;

const tripMainElement = document.querySelector(`.trip-main`);
const pointsElement = document.querySelector(`.trip-events`);
const addNewPointBtn = document.querySelector(`.trip-main__event-add-btn`);
const siteMenuTitleElements = tripMainElement.querySelectorAll(`.trip-controls h2`);
const [menuContainer, filterContainer] = siteMenuTitleElements;

const api = new Api(END_POINT, AUTHORIZATION);

const storePoints = new Store(STORE_POINTS_NAME, window.localStorage);
const storeOffers = new Store(STORE_OFFERS_NAME, window.localStorage);
const storeDestinations = new Store(STORE_DESTINATIONS_NAME, window.localStorage);
const apiWithProvider = new Provider(api, storePoints, storeOffers, storeDestinations);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const siteMenuComponent = new SiteMenuView();
const filterPresenter = new FilterPresenter(filterContainer, filterModel, pointsModel);
const headerPresenter = new HeaderPresenter(tripMainElement, pointsModel);
const tripPresenter = new TripPresenter(
    pointsElement,
    pointsModel,
    filterModel,
    offersModel,
    destinationsModel,
    apiWithProvider
);

let statisticsComponent = null;

const handlePointNewFormClose = () => {
  addNewPointBtn.disabled = false;
};

addNewPointBtn.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  remove(statisticsComponent);
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();

  if (!isOnline()) {
    toast(`You can't create a new point while offline`);
    return;
  }

  tripPresenter.createPoint(handlePointNewFormClose);
  addNewPointBtn.disabled = true;
});

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(pointsElement, statisticsComponent, RenderPosition.AFTEREND);
      break;
  }
  siteMenuComponent.setMenuItem(menuItem);
};

addNewPointBtn.disabled = true;
siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
headerPresenter.init();
filterPresenter.init();
tripPresenter.init();

Promise.all([apiWithProvider.getOffers(), apiWithProvider.getDestinations(), apiWithProvider.getPoints()])
  .then(([offers, destinations, points]) => {
    offersModel.setOffers(offers);
    destinationsModel.setDestinations(destinations);
    pointsModel.setPoints(UpdateType.INIT, points);
    addNewPointBtn.disabled = false;
    render(menuContainer, siteMenuComponent, RenderPosition.AFTEREND);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    addNewPointBtn.disabled = false;
    render(menuContainer, siteMenuComponent, RenderPosition.AFTEREND);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  showOnline();
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
  showOffline();
});
