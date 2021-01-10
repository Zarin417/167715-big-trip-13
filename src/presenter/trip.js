import SortListView from "../view/sort-list";
import TripEventsListView from "../view/events-list";
import EmptyEventsListView from "../view/empty-events-list";
import TripInfoView from "../view/trip-info";
import TripCostView from "../view/trip-cost";
import PointPresenter from "./point";
import {remove, render, RenderPosition} from "../utils/render";
import {updateItem} from "../utils/common";

export default class Trip {
  constructor(headerContainer, tripContainer) {
    this._tripContainer = tripContainer;
    this._headerContainer = headerContainer;
    this._pointPresenter = new Map();

    this._tripInfoComponent = null;
    this._tripCostComponent = null;
    this._sortComponent = new SortListView();
    this._tripListComponent = new TripEventsListView();
    this._emptyTripListComponent = new EmptyEventsListView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();

    if (points.length === 0) {
      this._renderEmptyList();
    } else {
      this._renderTripInfo(this._points);
      this._renderTripCost(this._points);
      this._renderSort();
      render(this._tripContainer, this._tripListComponent, RenderPosition.BEFORE_END);
      this._renderPoints(this._points);
    }
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatePoint) {
    this._points = updateItem(this._points, updatePoint);
    this._pointPresenter.get(updatePoint.id).init(updatePoint);
  }

  _renderTripInfo(points) {
    this._tripInfoComponent = new TripInfoView(points);
    render(this._headerContainer, this._tripInfoComponent, RenderPosition.AFTER_BEGIN);
  }

  _renderTripCost(points) {
    this._tripCostComponent = new TripCostView(points);
    render(this._tripInfoComponent, this._tripCostComponent, RenderPosition.BEFORE_END);
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFORE_END);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPoints(points) {
    for (let i = 0; i < points.length; i++) {
      this._renderPoint(points[i]);
    }
  }

  _renderEmptyList() {
    render(this._tripContainer, this._emptyTripListComponent, RenderPosition.BEFORE_END);
  }

  _clearTripList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter = new Map();
    remove(this._tripInfoComponent);
    remove(this._tripCostComponent);
    remove(this._sortComponent);
    remove(this._tripListComponent);
  }
}
