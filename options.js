"use strict";
let saveImagesOption = document.getElementById("save_images");
let thumbnailOption = document.getElementById("thumbnails");
function setCheckbox(data, checkbox) {
  checkbox.checked = data;
}

chrome.storage.local.get(["saveImages", "thumbnails"], function (data) {
  setCheckbox(data.saveImages, saveImagesOption);
  saveImagesOption.checked = data.saveImages === true;
  setCheckbox(data.thumbnails, thumbnailOption);
});

function storeOption(optionName, optionValue) {
  let data = {};
  data[optionName] = optionValue;
  chrome.storage.local.set(data);
}
saveImagesOption.onchange = function () {
  storeOption("saveImages", saveImagesOption.checked);
};
thumbnailOption.onchange = function () {
  storeOption("thumbnails", thumbnailOption.checked);
};
let savedImages = document.getElementById("savedImages");
let deleteButton = document.getElementById("delete_button");
deleteButton.onclick = function () {
  let blankArray = [];
  chrome.storage.local.set({ savedImages: blankArray });
  location.reload();
};
chrome.storage.local.get("savedImages", function (element) {
  let pageImages = element.savedImages;
  pageImages.forEach(function (image) {
    let newDiv = document.createElement("div");
    newDiv.className = "square";
    let newImage = document.createElement("img");
    newImage.src = image;
    newImage.addEventListener("click", function () {
      chrome.downloads.download({ url: newImage.src });
    });
    newDiv.appendChild(newImage);
    savedImages.appendChild(newDiv);
  });
});
