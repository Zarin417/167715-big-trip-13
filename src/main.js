import SiteMenuView from "./view/site-menu";
import SiteFiltersView from "./view/site-filters";
import TripPresenter from "./presenter/trip";
import {render, RenderPosition} from "./utils/render";
import {generatePoint} from "./mock/trip-point";

const POINTS_AMOUNT = 20;
const points = new Array(POINTS_AMOUNT).fill(undefined).map(generatePoint).sort((a, b) => {
  return new Date(a.date) - new Date(b.date);
});

const pageHeaderMain = document.querySelector(`.trip-main`);
const pageHeaderNav = pageHeaderMain.querySelector(`.trip-controls`);
const pageHeaderNavMenuTitle = pageHeaderNav.querySelector(`h2:first-child`);
const pageMainTripEvents = document.querySelector(`.trip-events`);
const tripPresenter = new TripPresenter(pageHeaderMain, pageMainTripEvents);

render(pageHeaderNavMenuTitle, new SiteMenuView(), RenderPosition.AFTER_END);
render(pageHeaderNav, new SiteFiltersView(), RenderPosition.BEFORE_END);

tripPresenter.init(points);
