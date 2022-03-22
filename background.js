/* eslint-disable no-param-reassign */
/* global chrome */

function audioAndTime() {
  const fullToday = new Date();

  const mes = fullToday.getMonth();
  const dia = fullToday.getDate();
  const ano = fullToday.getFullYear();

  const onlyToday = new Date(ano, mes, dia, 1, 21, 0);
  // console.log('onlyToday: ', onlyToday);

  const alarmV = Date.parse(onlyToday);
  console.log('alarmV: ', alarmV);
}

function showAlarms() {
  console.log('TOCOU O ALARME');
  // const audioAlarm = new Audio('alarm.wav');
  // audioAlarm.play();

  chrome.notifications.create(
    'reminder',
    {
      type: 'basic',
      iconUrl: 'Pedro.png',
      title: 'Don\'t forget!',
      message: 'You have things to do. Wake up, dude!',
    },
  );
}

try {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message === 'runAlarmsAnNotifications') {
      chrome.alarms.onAlarm.addListener(showAlarms);
      sendResponse('Saindo do background');
    }
  });
} catch (error) {
  console.log(error);
}
