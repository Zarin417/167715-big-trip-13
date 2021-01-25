import SortListView from "../view/sort-list";
import TripListView from "../view/trip-list";
import EmptyTripListView from "../view/empty-trip-list";
import TripInfoView from "../view/trip-info";
import TripCostView from "../view/trip-cost";
import PointPresenter from "./point";
import PointNewPresenter from "./point-new";
import {remove, render, RenderPosition} from "../utils/render";
import {SortType, UpdateType, UserActions, FilterType} from "../utils/const";
import {sortByPrice, sortByTime} from "../utils/point";
import {filter} from "../utils/filter";

export default class Trip {
  constructor(headerContainer, tripContainer, pointsModel, filterModel) {
    this._tripContainer = tripContainer;
    this._headerContainer = headerContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;
    this._tripInfoComponent = null;
    this._tripCostComponent = null;
    this._sortComponent = null;
    this._tripListComponent = new TripListView();
    this._emptyTripListComponent = new EmptyTripListView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._tripListComponent, this._handleViewAction);
  }

  init() {
    this._renderTrip();
  }

  createPoint() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }

    return filteredPoints;
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserActions.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserActions.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserActions.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
    }
  }

  _renderTripInfo(points) {
    this._tripInfoComponent = new TripInfoView(points);
    render(this._headerContainer, this._tripInfoComponent, RenderPosition.AFTER_BEGIN);
  }

  _renderTripCost(points) {
    this._tripCostComponent = new TripCostView(points);
    render(this._tripInfoComponent, this._tripCostComponent, RenderPosition.BEFORE_END);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip(true);
    this._renderTrip();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortListView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFORE_END);
  }

  _renderPoints(points) {
    render(this._tripContainer, this._tripListComponent, RenderPosition.BEFORE_END);
    points.forEach((point) => this._renderPoint(point));
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderEmptyList() {
    render(this._tripContainer, this._emptyTripListComponent, RenderPosition.BEFORE_END);
  }

  _renderTrip() {
    const points = this._getPoints();
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this._renderEmptyList();
    } else {
      this._renderTripInfo(points);
      this._renderTripCost(points);
      this._renderSort();
      this._renderPoints(points);
    }
  }

  _clearTrip(resetSortType = false) {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter = new Map();
    remove(this._tripInfoComponent);
    remove(this._tripCostComponent);
    remove(this._tripListComponent);
    remove(this._sortComponent);
    remove(this._emptyTripListComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
