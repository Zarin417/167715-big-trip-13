export const createNewPointDestination = (data) => {
  const {description, photos} = data;

  const addPhotos = () => {
    let photosList = ``;

    for (let i = 0; i < photos.length; i++) {
      photosList += `<img class="event__photo" src="${photos[i]}" alt="Event photo">`;
    }

    return `<div class="event__photos-container">
              <div class="event__photos-tape">
                ${photosList}
              </div>
            </div>`;
  };

  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>
            ${addPhotos()}
          </section>`;
};
