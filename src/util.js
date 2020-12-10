export const RenderPosition = {
  AFTER_BEGIN: `afterbegin`,
  AFTER_END: `afterend`,
  BEFORE_END: `beforeend`
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
