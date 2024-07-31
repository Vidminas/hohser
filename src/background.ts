// background script
chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {
  if (message.type === "searchResult") {
    fetch(message.url)
        .then((response) => response.text())
        .then((text) => {
          senderResponse(text);
        })
        .catch((error) => {
          console.error('Error:', error)
        });
    }
  return true
});