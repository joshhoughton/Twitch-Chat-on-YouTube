// background.js
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['src/bg/content.js',"js/jquery/jquery.min.js"]
    });
  });