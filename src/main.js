import TripInfoView from "./View/trip-info";
import TripCostView from "./View/trip-cost";
import SiteMenuView from "./View/site-menu";
import SiteFiltersView from "./View/site-filters";
import SortListView from "./View/sort-list";
import TripEventsListView from "./View/events-list";
import EventItemView from "./View/events-item";
import EmptyEventsListView from "./View/empty-events-list";
import PointEditView from "./View/point-edit";
import {render, RenderPosition, replace} from "./Utils/render";
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
    replace(pointEditComponent, pointComponent);
  };

  const replaceEditToPoint = () => {
    replace(pointComponent, pointEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceEditToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  pointComponent.setRollupBtnClickHandler(() => {
    replacePointToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  pointEditComponent.setFormSubmitHandler(() => {
    replaceEditToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  pointEditComponent.setRollupBtnClickHandler(() => {
    replaceEditToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(container, pointComponent, RenderPosition.BEFORE_END);
};

render(pageHeaderNavMenuTitle, new SiteMenuView(), RenderPosition.AFTER_END);
render(pageHeaderNav, new SiteFiltersView(), RenderPosition.BEFORE_END);

if (points.length === 0) {
  render(pageMainTripEventsTittle, new EmptyEventsListView(), RenderPosition.AFTER_END);
} else {
  render(pageHeaderMain, tripInfoComponent, RenderPosition.AFTER_BEGIN);
  render(tripInfoComponent, new TripCostView(points), RenderPosition.BEFORE_END);
  render(pageMainTripEventsTittle, new SortListView(), RenderPosition.AFTER_END);
  render(pageMainTripEvents, tripEventsListComponent, RenderPosition.BEFORE_END);

  for (let i = 0; i < POINTS_AMOUNT; i++) {
    renderEventItem(tripEventsListComponent, points[i]);
  }
}
