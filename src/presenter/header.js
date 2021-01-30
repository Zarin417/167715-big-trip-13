import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {getTripInfo, getTripPrice} from '../utils/point.js';
import {UpdateType} from '../utils/const.js';

export default class Header {
  constructor(headerContainer, pointsModel) {
    this._headerContainer = headerContainer;
    this._pointsModel = pointsModel;

    this._infoComponent = null;
    this._priceComponent = null;
    this._isLoading = true;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderInfo();
    this._renderPrice();
  }

  _renderInfo() {
    if (this._infoComponent !== null) {
      remove(this._infoComponent);
      this._infoComponent = null;
    }

    const info = getTripInfo(this._pointsModel.getPoints());
    this._infoComponent = new TripInfoView(info, this._isLoading);
    render(this._headerContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPrice() {
    if (this._priceComponent !== null) {
      remove(this._priceComponent);
      this._priceComponent = null;
    }

    const total = getTripPrice(this._pointsModel.getPoints());
    this._priceComponent = new TripCostView(total);
    render(this._infoComponent, this._priceComponent, RenderPosition.BEFOREEND);
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.INIT:
        this._isLoading = false;
        this.init();
        break;
      case UpdateType.MAJOR:
      case UpdateType.MINOR:
        this.init();
        break;
    }
  }
}
