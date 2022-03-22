/* eslint-disable no-param-reassign */
/* global chrome */

try {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    // 2. A page requested user data, respond with a copy of `user`
    console.log('Ouvindo msg: ', message);
    if (message === 'toTheBackground') {
      // console.log('Msg recebida, enviando "user"');
      console.log('chrome.alarms BACKGROUND: ', chrome.alarms);
      chrome.alarms.getAll((resp) => console.log('resp Alarms: ', resp));
      sendResponse('Saindo do background');
    }
  });

  // console.log(chrome);
} catch (error) {
  console.log(error);
}
