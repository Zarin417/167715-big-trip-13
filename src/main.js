import SiteMenuView from "./view/site-menu";
import StatisticsView from "./view/statistics";
import TripPresenter from "./presenter/trip";
import FilterPresenter from "./presenter/filter";
import PointsModel from "./model/points";
import FilterModel from "./model/filter";
import {remove, render, RenderPosition} from "./utils/render";
import {generatePoint} from "./mock/trip-point";
import {MenuItem} from "./utils/const";

const POINTS_AMOUNT = 20;
const points = new Array(POINTS_AMOUNT).fill(undefined).map(generatePoint);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const pageHeaderMain = document.querySelector(`.trip-main`);
const addNewEventBtn = pageHeaderMain.querySelector(`.trip-main__event-add-btn`);
const pageHeaderNav = pageHeaderMain.querySelector(`.trip-controls`);
const pageHeaderNavMenuTitle = pageHeaderNav.querySelector(`h2:first-child`);
const pageMainTripEvents = document.querySelector(`.trip-events`);
const siteMenuComponent = new SiteMenuView();

render(pageHeaderNavMenuTitle, siteMenuComponent, RenderPosition.AFTER_END);

const tripPresenter = new TripPresenter(pageHeaderMain, pageMainTripEvents, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(pageHeaderNav, filterModel);
let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      tripPresenter.init();
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(pageMainTripEvents, statisticsComponent, RenderPosition.AFTER_END);
      break;
  }
  siteMenuComponent.setMenuItem(menuItem);
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);


filterPresenter.init();
tripPresenter.init();

addNewEventBtn.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  handleSiteMenuClick(MenuItem.TABLE);
  tripPresenter.createPoint();
});
