'use strict';

(function () {
  var URL_PHOTOS = 'https://js.dump.academy/kekstagram/data';
  var RANDOM_PHOTOS_NUM = 10;
  var BUTTON_ACTIVE_CLASS = 'img-filters__button--active';
  var PICTURE_CLASS = '.picture';

  var imgFiltersElement = document.querySelector('.img-filters');
  var imgFiltersButtonElements = imgFiltersElement.querySelectorAll('.img-filters__button');
  var startData = [];

  var filters = {
    getDefault: function (array) {
      return array;
    },
    getRandom: function (array) {
      var copyArray = array.slice();
      var resultArray = [];
      for (var i = 0; i < RANDOM_PHOTOS_NUM; i++) {
        resultArray.push(copyArray.splice(window.util.getRandomNum(0, copyArray.length - 1), 1)[0]);
      }

      return resultArray;
    },
    getDiscussed: function (array) {
      var resultArray = array.slice();
      resultArray.sort(function (a, b) {
        if (a.comments.length < b.comments.length) {
          return 1;
        } else if (a.comments.length > b.comments.length) {
          return -1;
        }
        return 0;
      });
      return resultArray;
    }
  };

  var loadPhotos = function (data) {
    startData = data;
    appendPhotos(filterPhotos(startData));
    imgFiltersElement.classList.remove('img-filters--inactive');
  };

  var renderPhoto = function (template, item) {
    template.querySelector('.picture__img').src = item.url;
    template.querySelector('.picture__likes').textContent = item.likes;
    template.querySelector('.picture__comments').textContent = item.comments.length;

    template.addEventListener('click', function () {
      window.picture.show(item);
    });

    return template;
  };

  var appendPhotos = function (data) {
    var templatePictureElement = document.querySelector('#picture').content.querySelector(PICTURE_CLASS);
    var fragmentList = document.createDocumentFragment();

    data.forEach(function (item) {
      var currentPicture = renderPhoto(templatePictureElement.cloneNode(true), item);

      fragmentList.appendChild(currentPicture);
    });

    document.querySelectorAll(PICTURE_CLASS).forEach(function (item) {
      item.remove();
    });
    document.querySelector('.pictures').appendChild(fragmentList);
  };

  var filterPhotos = function (data, filter) {
    if (!filter) {
      filter = filters.getDefault;
    }

    var filteredData = filter(data);

    return filteredData;
  };

  var setPictureData = function (data) {
    var pictureImageElement = document.querySelector('.big-picture__img img');
    var pictureLikesElement = document.querySelector('.likes-count');
    var socialCaptionElement = document.querySelector('.social__caption');

    pictureImageElement.src = data.url;
    pictureLikesElement.textContent = data.likes;
    socialCaptionElement.textContent = data.description;
  };

  var onStatusError = function (status) {
    window.util.showError(status);
  };

  var getThisFilter = function (button) {
    return button.getAttribute('id').split('-')[1];
  };

  var switchClass = function (allElements, activeElement, className) {
    allElements.forEach(function (item) {
      item.classList.remove(className);
    });
    activeElement.classList.add(className);
  };

  var onImgFiltersButtonClick = function (evt) {
    var button = evt.target;
    var filter = getThisFilter(button);
    var currentFilter = getThisFilter(document.querySelector('.' + BUTTON_ACTIVE_CLASS));

    if (currentFilter === filter) {
      return;
    }

    var filterMethod;

    switch (filter) {
      case 'random':
        filterMethod = filters.getRandom;
        break;
      case 'discussed':
        filterMethod = filters.getDiscussed;
        break;
      default:
        filterMethod = filters.getDefault;
    }

    window.util.debounce(function () {
      appendPhotos(filterPhotos(startData, filterMethod));
    });
    switchClass(imgFiltersButtonElements, button, BUTTON_ACTIVE_CLASS);
  };

  imgFiltersButtonElements.forEach(function (item) {
    item.addEventListener('click', onImgFiltersButtonClick);
  });

  window.backend.load(URL_PHOTOS, loadPhotos, onStatusError);

  window.photos = {
    setPictureData: setPictureData
  };

}());
