chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: "https://github.com/KD3n1z/chesspp" });
});