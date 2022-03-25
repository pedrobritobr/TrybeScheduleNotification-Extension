/* eslint-disable no-param-reassign */
/* global chrome */
async function savedAlarms() {
  console.log('------ savedAlarms  ------');
  console.log('HORA AGORA: ', Date());
  console.log('HORA EPOCH: ', Date.now());
  console.log('await chrome.alarms.getAll(): ', await chrome.alarms.getAll());
}

function fireAlarm(actualAlarm) {
  const [title, zoomLink = 'reminder'] = actualAlarm.name.split('@@@');

  const thereIs = 'There is a zoom link\n***CLICK ME***';
  const thereIsNot = 'There is NOT a zoom link';
  const notfMessage = zoomLink.includes('zoom.us') ? thereIs : thereIsNot;
  const notifName = zoomLink;

  chrome.windows.create({ url: './play-alarm-sound/index.html', state: 'minimized' });
  chrome.notifications.create(
    notifName,
    {
      type: 'basic',
      iconUrl: 'Pedro.png',
      title,
      message: notfMessage,
      priority: 2,
    },
  );

  setTimeout(() => {
    chrome.notifications.clear(notifName, () => {});
  }, 10000);
}

try {
  chrome.runtime.onMessage.addListener((message) => {
    if (message === 'runAlarmsAnNotifications') {
      savedAlarms();
      return true;
    }
    return false;
  });

  chrome.alarms.onAlarm.addListener(fireAlarm);

  chrome.notifications.onClicked.addListener((notifName) => {
    if (notifName.includes('zoom.us')) chrome.tabs.create({ url: notifName });
  });

  setInterval(savedAlarms, 10000);
} catch (error) {
  console.log(error);
}
