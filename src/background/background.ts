chrome.action.onClicked.addListener((tab) => {
  if (tab.id === undefined) {
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['main.js'],
  });
});
