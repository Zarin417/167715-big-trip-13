import SortListView from "../view/sort-list";
import TripEventsListView from "../view/events-list";
import EmptyEventsListView from "../view/empty-events-list";
import TripInfoView from "../view/trip-info";
import TripCostView from "../view/trip-cost";
import PointPresenter from "./point";
import {remove, render, RenderPosition} from "../utils/render";
import {updateItem} from "../utils/common";
import {SortType} from "../utils/const";
import {sortByDate, sortByPrice, sortByTime} from "../utils/point";

export default class Trip {
  constructor(headerContainer, tripContainer) {
    this._tripContainer = tripContainer;
    this._headerContainer = headerContainer;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DAY;

    this._tripInfoComponent = null;
    this._tripCostComponent = null;
    this._sortComponent = new SortListView();
    this._tripListComponent = new TripEventsListView();
    this._emptyTripListComponent = new EmptyEventsListView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = points.slice().sort(sortByDate);
    this._sourcedPoints = points.slice().sort(sortByDate);

    if (points.length === 0) {
      this._renderEmptyList();
    } else {
      this._renderTripInfo(this._points);
      this._renderTripCost(this._points);
      this._renderSort();
      this._renderPoints();
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

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._points.sort(sortByTime);
        break;
      case SortType.PRICE:
        this._points.sort(sortByPrice);
        break;
      default:
        this._points = this._sourcedPoints.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearTripList();
    this._renderPoints();
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFORE_END);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPoints() {
    render(this._tripContainer, this._tripListComponent, RenderPosition.BEFORE_END);

    for (let i = 0; i < this._points.length; i++) {
      this._renderPoint(this._points[i]);
    }
  }

  _renderEmptyList() {
    render(this._tripContainer, this._emptyTripListComponent, RenderPosition.BEFORE_END);
  }

  _clearTripList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter = new Map();
    remove(this._tripListComponent);
  }
}
