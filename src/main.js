import TripInfoView from "./View/trip-info";
import TripCostView from "./View/trip-cost";
import SiteMenuView from "./View/site-menu";
import SiteFiltersView from "./View/site-filters";
import SortListView from "./View/sort-list";
import TripEventsListView from "./View/events-list";
import EventItemView from "./View/events-item";
import EmptyEventsListView from "./View/empty-events-list";
import PointEditView from "./View/point-edit";
import {render, RenderPosition} from "./utils";
import {generatePoint} from "./mock/trip-point";

const POINTS_AMOUNT = 20;
const points = new Array(POINTS_AMOUNT).fill(undefined).map(generatePoint).sort((a, b) => {
  return new Date(a.date) - new Date(b.date);
});

const pageHeaderMain = document.querySelector(`.trip-main`);
const pageHeaderNav = pageHeaderMain.querySelector(`.trip-controls`);
const pageHeaderNavMenuTitle = pageHeaderNav.querySelector(`h2:first-child`);
const pageMainTripEvents = document.querySelector(`.trip-events`);
const pageMainTripEventsTittle = pageMainTripEvents.querySelector(`h2:first-child`);
const tripInfoComponent = new TripInfoView(points);
const tripEventsListComponent = new TripEventsListView();

const renderEventItem = (container, pointData) => {
  const pointComponent = new EventItemView(pointData);
  const pointEditComponent = new PointEditView(pointData, true);

  const replacePointToEdit = () => {
    container.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };

  const replaceEditToPoint = () => {
    container.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
  };

  pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replacePointToEdit();
  });

  pointEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToPoint();
  });

  render(container, pointComponent.getElement(), RenderPosition.BEFORE_END);
};

render(pageHeaderNavMenuTitle, new SiteMenuView().getElement(), RenderPosition.AFTER_END);
render(pageHeaderNav, new SiteFiltersView().getElement(), RenderPosition.BEFORE_END);

if (points.length === 0) {
  render(pageMainTripEventsTittle, new EmptyEventsListView().getElement(), RenderPosition.AFTER_END);
} else {
  render(pageHeaderMain, tripInfoComponent.getElement(), RenderPosition.AFTER_BEGIN);
  render(tripInfoComponent.getElement(), new TripCostView(points).getElement(), RenderPosition.BEFORE_END);
  render(pageMainTripEventsTittle, new SortListView().getElement(), RenderPosition.AFTER_END);
  render(pageMainTripEvents, tripEventsListComponent.getElement(), RenderPosition.BEFORE_END);

  for (let i = 0; i < POINTS_AMOUNT; i++) {
    renderEventItem(tripEventsListComponent.getElement(), points[i]);
  }
}
