import AbstractView from "./abstract";

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

export default class SiteFiltersView extends AbstractView {
  getTemplate() {
    return createSiteFiltersTemplate();
  }
}
