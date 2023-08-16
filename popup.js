"use strict";

const scriptCode = `(function() {
      let images = document.querySelectorAll('img');
      let srcArray =
           Array.from(images).map(function(image) {
             return image.currentSrc;
           });
      return srcArray
    })();`;
function addImage(url) {
  chrome.storage.local.get("savedImages", function (result) {
    let downloadsArray = result.savedImages || [];
    downloadsArray.push(url);
    chrome.storage.local.set({ savedImages: downloadsArray }, function () {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      } else {
        console.log("Image saved successfully");
      }
    });
  });
}
let imageDiv = document.getElementById("image_div");
function setUp(array) {
  chrome.storage.local.get(["saveImages", "thumbnails"], function (config) {
    for (let src of array) {
      let newImage = document.createElement("img");
      let lineBreak = document.createElement("br");
      newImage.src = src;
      console.log(newImage);
      // Add an onclick event listener
      newImage.addEventListener("click", function () {
        // Downloads and image when it is clicked on
        chrome.downloads.download({ url: newImage.src });
        // Checks if extension is set to store images
        if (config.saveImages === true) {
          // If true, call addImage function
          addImage(newImage.src);
        }
      });
      // Checks extension thumbnail settings
      if (config.thumbnails === true) {
        // If on, popup displays images as thumnails
        let newDiv = document.createElement("div");
        newDiv.className = "square";
        newDiv.appendChild(newImage);
        imageDiv.appendChild(newDiv);
      } else {
        // If off, images are displayed at full size
        imageDiv.appendChild(newImage);
      }
      imageDiv.appendChild(lineBreak);
    }
  });
}

// Runs script when popup is opened
chrome.tabs.executeScript({ code: scriptCode }, function (result) {
  setUp(result[0]);
});

let optionsButton = document.getElementById("options_button");

optionsButton.onclick = function () {
  chrome.tabs.create({ url: "options.html" });
};
