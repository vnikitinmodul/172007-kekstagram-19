'use strict';

(function () {
  var COMMENT_IMG_SIZE = 35;
  var COMMENTS_CHUNK_NUM = 5;
  var SOCIAL_COMMENT_CLASS = 'social__comment';

  var socialCommentsElement = document.querySelector('.social__comments');
  var socialCommentsLoaderElement = document.querySelector('.social__comments-loader');
  var commentsCountElement = document.querySelector('.comments-count');
  var commentsCountAllElement = document.querySelector('.comments-count-all');
  var currentTemplate;
  var loadedComments = 0;
  var currentData = [];

  var showCommentsNav = function () {
    window.util.showBlock(socialCommentsLoaderElement);

    loadedComments += COMMENTS_CHUNK_NUM;

    if (loadedComments === COMMENTS_CHUNK_NUM) {
      socialCommentsLoaderElement.addEventListener('click', onCommentsLoaderClick);
    }
  };

  var hideCommentsNav = function () {
    window.util.hideBlock(socialCommentsLoaderElement);
    socialCommentsLoaderElement.removeEventListener('click', onCommentsLoaderClick);
  };

  var setCommentsNum = function (num) {
    commentsCountElement.textContent = loadedComments;
    commentsCountAllElement.textContent = num;
  };

  var checkIsAllLoaded = function (array) {
    return array.length === loadedComments;
  };

  var resetComments = function () {
    loadedComments = 0;
    currentData = [];
  };

  var appendToFragment = function (template, templateList, data) {
    template.querySelector('.social__picture').src = data.avatar;
    template.querySelector('.social__picture').alt = data.name;
    template.querySelector('.social__text').textContent = data.message;
    templateList.appendChild(template);
  };

  var putComments = function (data, template) {
    var commentsArray = data.comments;
    var firstCommentNum;
    var lastCommentNum;
    var fragmentList = document.createDocumentFragment();

    currentData = data;
    currentTemplate = template;

    if (!checkIsAllLoaded(commentsArray)) {
      firstCommentNum = loadedComments;
      lastCommentNum = commentsArray.length <= loadedComments + COMMENTS_CHUNK_NUM ? commentsArray.length : loadedComments + COMMENTS_CHUNK_NUM;

      for (var j = firstCommentNum; j < lastCommentNum; j++) {
        appendToFragment(template.cloneNode(true), fragmentList, commentsArray[j]);
      }

      socialCommentsElement.appendChild(fragmentList);
    }

    if (commentsArray.length > loadedComments + COMMENTS_CHUNK_NUM) {
      showCommentsNav();
    } else {
      hideCommentsNav();
      loadedComments = commentsArray.length;
    }

    setCommentsNum(commentsArray.length);

    if (checkIsAllLoaded(commentsArray)) {
      resetComments();
    }
  };

  var onCommentsLoaderClick = function () {
    putComments(currentData, currentTemplate, true);
  };

  window.comments = {
    DEFAULT_NUM: COMMENTS_CHUNK_NUM,
    clear: function () {
      var startCommentsElements = socialCommentsElement.querySelectorAll('.' + SOCIAL_COMMENT_CLASS);

      startCommentsElements.forEach(function (item) {
        item.remove();
      });
    },
    render: function () {
      var commentTemplate = document.createElement('li');
      var commentImg = document.createElement('img');
      var commentText = document.createElement('p');

      commentTemplate.classList.add(SOCIAL_COMMENT_CLASS);
      commentImg.classList.add('social__picture');
      commentText.classList.add('social__text');

      commentImg.width = COMMENT_IMG_SIZE;
      commentImg.height = COMMENT_IMG_SIZE;

      commentTemplate.appendChild(commentImg);
      commentTemplate.appendChild(commentText);

      return commentTemplate;
    },
    put: putComments,
    reset: resetComments,
    onLoaderClick: onCommentsLoaderClick
  };

}());
