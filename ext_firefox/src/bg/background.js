chrome.pageAction.onClicked.addListener((tab) => {
    chrome.tabs.executeScript({
      file: "js/jquery/jquery.min.js"
    });
    chrome.tabs.executeScript({
        file: "src/bg/content.js"
    });
  });