import SiteMenuView from "./view/site-menu";
import TripPresenter from "./presenter/trip";
import FilterPresenter from "./presenter/filter";
import PointsModel from "./model/points";
import FilterModel from "./model/filter";
import {render, RenderPosition} from "./utils/render";
import {generatePoint} from "./mock/trip-point";

const POINTS_AMOUNT = 20;
const points = new Array(POINTS_AMOUNT).fill(undefined).map(generatePoint);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const pageHeaderMain = document.querySelector(`.trip-main`);
const pageHeaderNav = pageHeaderMain.querySelector(`.trip-controls`);
const pageHeaderNavMenuTitle = pageHeaderNav.querySelector(`h2:first-child`);
const pageMainTripEvents = document.querySelector(`.trip-events`);
render(pageHeaderNavMenuTitle, new SiteMenuView(), RenderPosition.AFTER_END);

const tripPresenter = new TripPresenter(pageHeaderMain, pageMainTripEvents, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(pageHeaderNav, filterModel);

filterPresenter.init();
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
