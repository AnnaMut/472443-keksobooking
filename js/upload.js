'use strict';

(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var avatarChooser = document.querySelector('.ad-form-header__upload input[type=file]');
  var avatarDropZone = avatarChooser.parentElement;
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var avatarDefaultSrc = avatarPreview.src;
  var imagesChooser = document.querySelector('.ad-form__upload input[type=file]');
  var imagesDropZone = imagesChooser.parentElement;
  var imagesPreview = document.querySelector('.ad-form__photo-container');
  var photos = imagesPreview.querySelectorAll('div');
  var dragstartItem = null;
  var removedArray = [];
  var avatarId = 'avatar';
  var previewBox = 'ad-form__field';

  var checkFileType = function (fileName) {
    fileName = fileName.toLowerCase();
    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  };

  var getImagesPreview = function (dataURL) {
    var imagesBox = document.createElement('div');
    imagesBox.className = 'ad-form__photo';
    var img = document.createElement('img');
    img.width = 70;
    img.height = 70;
    img.src = dataURL;
    img.addEventListener('dragstart', dragStartHandler);
    imagesBox.appendChild(img);
    removedArray.push(imagesBox);
    imagesPreview.appendChild(imagesBox);
  };

  var setUrlData = function (file, avatarItem) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      if (avatarItem) {
        avatarPreview.src = reader.result;
      } else {
        getImagesPreview(reader.result);
        photos[1].classList.remove('ad-form__photo');
      }
    });
    reader.readAsDataURL(file);
  };

  var inputChangeHandler = function (evt) {
    if (!evt.currentTarget.files.length) {
      return;
    }
    var avatarItem = evt.currentTarget.id === avatarId;
    var file = evt.currentTarget.files[0];
    if (checkFileType(file.name)) {
      setUrlData(file, avatarItem);
    }
  };

  var dropZoneDropHandler = function (evt) {
    var file = evt.dataTransfer.files[0];
    var item = evt.currentTarget.className === previewBox;
    if (checkFileType(file.name)) {
      setUrlData(file, item);
    }
    evt.preventDefault();
  };

  var dropZoneDragOverHandler = function (evt) {
    evt.preventDefault();
  };

  var dragEndHandler = function () {
    removedArray.forEach(function (item) {
      if (!item.dataset.dragstart) {
        item.firstChild.removeEventListener('dragover', dropZoneDragOverHandler);
        item.firstChild.removeEventListener('drop', itemDropHandler);
      }
    });
    dragstartItem.parentElement.dataset.dragstart = '';
    dragstartItem.removeEventListener('dragend', dragEndHandler);
  };

  var itemDropHandler = function (evt) {
    var dataUrlTransfered = dragstartItem.src;
    dragstartItem.src = evt.currentTarget.src;
    evt.currentTarget.src = dataUrlTransfered;
    dragEndHandler();
  };

  var dragStartHandler = function (evt) {
    dragstartItem = evt.target;
    dragstartItem.parentElement.dataset.dragstart = true;
    dragstartItem.addEventListener('dragend', dragEndHandler);
    removedArray.forEach(function (element) {
      if (!element.dataset.dragstart) {
        element.firstChild.addEventListener('dragover', dropZoneDragOverHandler);
        element.firstChild.addEventListener('drop', itemDropHandler);
      }
    });
  };

  avatarChooser.addEventListener('change', inputChangeHandler);
  imagesChooser.addEventListener('change', inputChangeHandler);
  avatarDropZone.addEventListener('dragover', dropZoneDragOverHandler);
  avatarDropZone.addEventListener('drop', dropZoneDropHandler);
  imagesDropZone.addEventListener('dragover', dropZoneDragOverHandler);
  imagesDropZone.addEventListener('drop', dropZoneDropHandler);

  var removeUpload = function () {
    avatarPreview.src = avatarDefaultSrc;
    removedArray.forEach(function (item) {
      imagesPreview.removeChild(item);
    });
    photos[1].classList.add('ad-form__photo');
  };

  window.upload = {
    removeUpload: removeUpload
  };

})();
