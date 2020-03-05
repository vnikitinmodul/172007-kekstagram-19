'use strict';

(function () {
  var COMMENT_IMG_SIZE = 35;
  var COMMENTS_CHUNK_NUM = 5;

  var socialComments = document.querySelector('.social__comments');
  var socialCommentsLoader = document.querySelector('.social__comments-loader');
  var commentsCount = document.querySelector('.comments-count');
  var commentsCountAll = document.querySelector('.comments-count-all');
  var currentTemplate;
  var loadedComments = 0;
  var currentData = [];
  var isAllLoaded = false;

  var showCommentsNav = function () {
    window.util.showBlock(socialCommentsLoader);

    loadedComments += COMMENTS_CHUNK_NUM;

    if (loadedComments === COMMENTS_CHUNK_NUM) {
      socialCommentsLoader.addEventListener('click', onCommentsLoaderClick);
    }
  };

  var hideCommentsNav = function () {
    window.util.hideBlock(socialCommentsLoader);
    socialCommentsLoader.removeEventListener('click', onCommentsLoaderClick);
  };

  var setCommentsNum = function (num) {
    commentsCount.textContent = loadedComments;
    commentsCountAll.textContent = num;
  };

  var checkIsAllLoaded = function (array) {
    return array.length === loadedComments;
  };

  var resetComments = function () {
    loadedComments = 0;
    currentData = [];
    isAllLoaded = false;
  };

  var putComments = function (data, template) {
    var commentsArray = data.comments;
    var firstCommentNum;
    var lastCommentNum;
    var fragmentList = document.createDocumentFragment();

    isAllLoaded = checkIsAllLoaded(commentsArray);
    currentData = data;
    currentTemplate = template;

    if (!isAllLoaded) {
      firstCommentNum = loadedComments;
      lastCommentNum = commentsArray.length <= loadedComments + COMMENTS_CHUNK_NUM ? commentsArray.length : loadedComments + COMMENTS_CHUNK_NUM;

      for (var l = firstCommentNum; l < lastCommentNum; l++) {
        var currentCommentDOM = template.cloneNode(true);
        var currentComment = commentsArray[l];

        currentCommentDOM.querySelector('.social__picture').src = currentComment.avatar;
        currentCommentDOM.querySelector('.social__picture').alt = currentComment.name;
        currentCommentDOM.querySelector('.social__text').textContent = currentComment.message;
        fragmentList.appendChild(currentCommentDOM);
      }

      socialComments.appendChild(fragmentList);
    }

    if (commentsArray.length > loadedComments + COMMENTS_CHUNK_NUM) {
      showCommentsNav();
    } else {
      hideCommentsNav();
      loadedComments = commentsArray.length;
    }

    isAllLoaded = checkIsAllLoaded(commentsArray);

    setCommentsNum(commentsArray.length);

    if (isAllLoaded) {
      resetComments();
    }
  };

  var onCommentsLoaderClick = function () {
    putComments(currentData, currentTemplate, true);
  };

  window.comments = {
    DEFAULT_NUM: COMMENTS_CHUNK_NUM,
    clear: function () {
      var startComments = socialComments.querySelectorAll('.social__comment');

      startComments.forEach(function (item) {
        item.remove();
      });
    },
    render: function () {
      var commentTemplate = document.createElement('li');
      var commentImg = document.createElement('img');
      var commentText = document.createElement('p');

      commentTemplate.classList.add('social__comment');
      commentImg.classList.add('social__picture');
      commentText.classList.add('social__text');

      commentImg.width = COMMENT_IMG_SIZE;
      commentImg.height = COMMENT_IMG_SIZE;

      commentTemplate.appendChild(commentImg);
      commentTemplate.appendChild(commentText);

      return commentTemplate;
    },
    put: putComments,
    get: function () {
      var commentsArray = [];

      for (var i = 0; i < window.util.getRandomNum(window.mockData.CommentsNum.MIN, window.mockData.CommentsNum.MAX); i++) {
        var currentComment = {
          avatar: 'img/avatar-' + window.util.getRandomNum(window.mockData.AvatarsNum.MIN, window.mockData.AvatarsNum.MAX) + '.svg',
          message: window.mockData.COMMENTS[window.util.getRandomNum(0, window.mockData.COMMENTS.length - 1)],
          name: window.mockData.NAMES[window.util.getRandomNum(0, window.mockData.NAMES.length - 1)]
        };

        commentsArray.push(currentComment);
      }

      return commentsArray;
    },
    reset: resetComments,
    onLoaderClick: onCommentsLoaderClick
  };

}());
