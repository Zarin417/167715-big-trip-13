import SortListView from '../view/sort-list.js';
import EmptyTripListView from '../view/empty-trip-list.js';
import TripListView from '../view/trip-list.js';
import LoadingView from '../view/loading.js';
import PointPresenter, {State as PointPresenterViewState} from './point.js';
import PointNewPresenter from './point-new.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {sortByDate, sortByTime, sortByPrice} from '../utils/point.js';
import {filter} from '../utils/filter.js';
import {SortType, UserAction, UpdateType} from '../utils/const.js';

export default class Trip {
  constructor(pointContainer, pointsModel, filterModel, offersModel, destinationsModel, api) {
    this._pointContainer = pointContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._api = api;
    this._isLoading = true;
    this._pointPresenterMap = new Map();
    this._currentSortType = SortType.DAY;
    this._sortComponent = null;

    this._noPointComponent = new EmptyTripListView();
    this._pointListComponent = new TripListView();
    this._loadingComponent = new LoadingView();
    this._pointNewPresenter = new PointNewPresenter(this._pointListComponent, this._handleViewAction);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._renderTrip();
  }

  createPoint(callback) {
    this._pointNewPresenter.init(this._offersModel, this._destinationsModel, callback);
  }

  destroy() {
    this._clearTrip({resetSortType: true});
    remove(this._pointListComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDate);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      default:
        return filteredPoints;
    }
  }

  _renderLoading() {
    render(this._pointContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortListView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._pointContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point, this._offersModel, this._destinationsModel);
    this._pointPresenterMap.set(point.id, pointPresenter);
  }

  _renderPoints(points) {
    points.forEach((point) => this._renderPoint(point));
  }

  _renderNoPoints() {
    render(this._pointContainer, this._noPointComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints();

    if (points.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    render(this._pointContainer, this._pointListComponent, RenderPosition.BEFOREEND);
    this._renderPoints(points);
  }

  _clearTrip({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();

    this._pointPresenterMap.forEach((presenter) => presenter.destroy());
    this._pointPresenterMap.clear();

    remove(this._loadingComponent);
    remove(this._sortComponent);
    remove(this._noPointComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => this._pointsModel.addPoint(updateType, response))
          .catch(() => this._pointNewPresenter.setAborting());
        break;
      case UserAction.UPDATE_POINT:
        this._pointPresenterMap.get(update.id).setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => this._pointsModel.updatePoint(updateType, response))
          .catch(() => this._pointPresenterMap.get(update.id).setViewState(PointPresenterViewState.ABORTING));
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenterMap.get(update.id).setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => this._pointsModel.deletePoint(updateType, update))
          .catch(() => this._pointPresenterMap.get(update.id).setViewState(PointPresenterViewState.ABORTING));
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenterMap.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenterMap.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }
}
