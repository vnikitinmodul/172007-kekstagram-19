'use strict';

(function () {
  var pictureCancelElement = document.querySelector('#picture-cancel');
  var socialFooterTextElement = document.querySelector('.social__footer-text');
  var socialCommentsLoaderElement = document.querySelector('.social__comments-loader');
  var bigPictureElement = document.querySelector('.big-picture');

  var showPhotoModal = function () {
    document.addEventListener('keydown', onPictureEscPress);
    pictureCancelElement.addEventListener('click', onPictureCloseClick);
    window.util.switchBodyModalMode();
    window.util.showBlock(bigPictureElement);
  };

  var hidePhotoModal = function () {
    document.removeEventListener('keydown', onPictureEscPress);
    pictureCancelElement.removeEventListener('click', onPictureCloseClick);
    socialCommentsLoaderElement.removeEventListener('click', window.comments.onLoaderClick);
    window.comments.reset();
    window.util.switchBodyModalMode(true);
    window.util.hideBlock(bigPictureElement);
  };

  var showPicture = function (data) {
    window.photos.setPictureData(data);
    window.comments.clear();
    window.comments.put(data, window.comments.render());

    showPhotoModal();
  };

  var onPictureCloseClick = function () {
    hidePhotoModal();
  };

  var onPictureEscPress = function (evt) {
    if (evt.key === window.util.Key.ESC && evt.target && evt.target !== socialFooterTextElement) {
      hidePhotoModal();
    }
  };

  window.picture = {
    show: showPicture
  };

}());
