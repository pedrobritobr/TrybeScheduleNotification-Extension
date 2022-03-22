/* eslint-disable no-param-reassign */
/* global chrome */

try {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message === 'toTheBackground') {
      chrome.alarms.getAll((resp) => console.log('resp Alarms: ', resp));
      sendResponse('Saindo do background');
    }
  });
} catch (error) {
  console.log(error);
}
