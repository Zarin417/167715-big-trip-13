import {createElement} from "../utils";

const FILTERS = [
  `Everything`,
  `Future`,
  `Past`
];

const createSiteFiltersTemplate = () => {
  let filtersList = ``;

  FILTERS.forEach((filter) => {
    filtersList += `<div class="trip-filters__filter">
                  <input id="filter-${filter.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.toLowerCase()}">
                  <label class="trip-filters__filter-label" for="filter-${filter.toLowerCase()}">${filter}</label>
                </div>`;
  });

  return `<form class="trip-filters" action="#" method="get">
            ${filtersList}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};

export default class SiteFiltersView {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSiteFiltersTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
