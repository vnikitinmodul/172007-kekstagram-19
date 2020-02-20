'use strict';

(function () {
  var pictureCancel = document.querySelector('#picture-cancel');
  var socialFooterText = document.querySelector('.social__footer-text');

  var showPhotoModal = function () {
    document.addEventListener('keydown', onPictureEscPress);
    pictureCancel.addEventListener('click', onPictureCloseClick);
    window.util.switchBodyModalMode();
    window.util.showBlock('.big-picture');
  };

  var hidePhotoModal = function () {
    document.removeEventListener('keydown', onPictureEscPress);
    pictureCancel.removeEventListener('click', onPictureCloseClick);
    window.util.switchBodyModalMode(true);
    window.util.hideBlock('.big-picture');
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
    if (evt.key === window.util.Key.ESC && evt.target && evt.target !== socialFooterText) {
      hidePhotoModal();
    }
  };

  window.picture = {
    showPicture: showPicture
  };

}());
