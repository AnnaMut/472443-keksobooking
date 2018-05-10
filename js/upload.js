'use strict';

(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var avatarChooser = document.querySelector('.ad-form-header__upload input[type=file]');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var imagesChooser = document.querySelector('.ad-form__upload input[type=file]');
  var imagesPreview = document.querySelector('.ad-form__photo-container');
  var avatarDropZone = document.querySelector('.ad-form-header__drop-zone');
  var imagesDropZone = document.querySelector('.ad-form__drop-zone');
  var dragstartItem = null;
  var avatarDefaultSrc = avatarPreview.src;
  var photos = imagesPreview.querySelectorAll('div');

  var checkFileType = function (name) {
    return FILE_TYPES.some(function (it) {
      return name.endsWith(it);
    });
  };

  var setImageData = function (image, reader) {
    reader.addEventListener('load', function () {
      image.src = reader.result;
      imagesPreview.appendChild(image);
    });
  };

  var loadAvatar = function (file) {
    if (file) {
      var fileName = file.name.toLowerCase();
      var matches = checkFileType(fileName);
      if (matches) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          avatarPreview.src = reader.result;
        });
        reader.readAsDataURL(file);
      }
    }
  };
  var avatarChangeHandler = function () {
    var file = avatarChooser.files[0];
    loadAvatar(file);
  };

  var dragEnterHandler = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };

  var dragOverHandler = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };

  var imagesDragAndDropHandler = function (evt) {
    evt.stopPropagation();
    var item = evt.target;
    imagesPreview.insertBefore(dragstartItem, item);
  };

  var loadImages = function (file) {
    if (file) {
      var fileName = file.name.toLowerCase();
      var matches = checkFileType(fileName);
      if (matches) {
        var reader = new FileReader();
        var image = document.createElement('img');
        image.width = 70;
        image.height = 70;
        image.style.margin = '5px';
        image.draggable = 'true';
        image.addEventListener('dragenter', dragEnterHandler);
        image.addEventListener('dragover', dragOverHandler);
        image.addEventListener('drop', imagesDragAndDropHandler);
        setImageData(image, reader);
        reader.readAsDataURL(file);
        photos[1].classList.remove('ad-form__photo');
      }
    }
  };

  var imagesChangeHandler = function () {
    var files = imagesChooser.files;
    Array.prototype.forEach.call(files, (function (file) {
      loadImages(file);
    }));
  };

  var imagesDragStartHandler = function (evt) {
    if (evt.target.tagName === 'IMG') {
      evt.dataTransfer.setData('text/plain', evt.target.alt);
      dragstartItem = evt.target;
    }
  };

  var avatarDropHandler = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files;
    loadAvatar(files[0]);
  };

  var imagesDropHandler = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files;
    loadImages(files[0]);
  };

  var removeUpload = function () {
    avatarPreview.src = avatarDefaultSrc;
    var images = imagesPreview.querySelectorAll('img');
    images.forEach(function (it) {
      imagesPreview.removeChild(it);
    });
    photos[1].classList.add('ad-form__photo');
  };

  avatarChooser.addEventListener('change', avatarChangeHandler);
  imagesChooser.addEventListener('change', imagesChangeHandler);
  avatarDropZone.addEventListener('dragenter', dragEnterHandler);
  avatarDropZone.addEventListener('dragover', dragOverHandler);
  avatarDropZone.addEventListener('drop', avatarDropHandler);
  imagesPreview.addEventListener('dragstart', imagesDragStartHandler);
  imagesDropZone.addEventListener('dragenter', dragEnterHandler);
  imagesDropZone.addEventListener('dragover', dragOverHandler);
  imagesDropZone.addEventListener('drop', imagesDropHandler);

  window.upload = {
    removeUpload: removeUpload
  };

})();
