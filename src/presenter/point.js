import EventItemView from "../view/events-item";
import PointEditView from "../view/point-edit";
import {render, RenderPosition, replace, remove} from "../utils/render";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {
  constructor(tripListContainer, changeData, changeMode) {
    this._tripListContainer = tripListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handlePointRollupBtnClick = this._handlePointRollupBtnClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleEditRollupBtnClick = this._handleEditRollupBtnClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new EventItemView(point);
    this._pointEditComponent = new PointEditView(point, true);

    this._pointComponent.setRollupBtnClickHandler(this._handlePointRollupBtnClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditComponent.setRollupBtnClickHandler(this._handleEditRollupBtnClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._tripListContainer, this._pointComponent, RenderPosition.BEFORE_END);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  _replacePointToEdit() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceEditToPoint();
    }
  }

  _handlePointRollupBtnClick() {
    this._replacePointToEdit();
  }

  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceEditToPoint();
  }

  _handleEditRollupBtnClick() {
    this._replaceEditToPoint();
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._point,
            {
              isFavourite: !this._point.isFavourite
            }
        )
    );
  }
}
