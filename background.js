"use strict";

let downloadsArray = [];
let initialState = {
  savedImages: downloadsArray,
  thumbnails: false,
  saveImages: true,
};
chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "developer.chrome.com", schemes: ["https"] },
            css: ["img"],
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
  chrome.storage.local.set(initialState);
});
