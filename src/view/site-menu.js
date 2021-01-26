import AbstractView from "./abstract";
import {MenuItem} from "../utils/const";

const createSiteMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
            <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
            <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
          </nav>`;
};

export default class SiteMenuView extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[data-menu-item=${menuItem}]`);

    if (item !== null) {
      this.getElement().querySelectorAll(`.trip-tabs__btn`).forEach((itemMenu) => itemMenu.classList.remove(`trip-tabs__btn--active`));
      item.classList.add(`trip-tabs__btn--active`);
    }
  }

  _menuClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.classList.contains(`trip-tabs__btn--active`)) {
      return;
    }

    this._callback.menuClick(evt.target.dataset.menuItem);
  }
}
