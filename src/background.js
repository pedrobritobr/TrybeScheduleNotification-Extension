/* eslint-disable no-param-reassign */
/* global chrome */
async function savedAlarms() {
  console.log('------ savedAlarms  ------');
  console.log('HORA AGORA: ', Date());
  console.log('HORA EPOCH: ', Date.now());
  console.log('await chrome.alarms.getAll(): ', await chrome.alarms.getAll());
}

async function fireAlarm(actualAlarm) {
  const [taskName, zoomLinkTask] = actualAlarm.name.split('@@@');
  const taskInformation = { taskName, zoomLinkTask };

  await chrome.storage.sync.set({ taskInformation });

  const popupHeight = 280;
  const popupWidth = 450;

  const monitors = await chrome.system.display.getInfo();
  const { bounds: pMonitor } = monitors.find((monitor) => monitor.isPrimary);
  const { height: monitorHeight, width: monitorWidth } = pMonitor;

  chrome.windows.create({
    url: './src/play-alarm-sound/index.html',
    height: popupHeight,
    width: popupWidth,
    left: (monitorWidth / 2) - (popupWidth / 2),
    top: (monitorHeight / 2) - (popupHeight),
    type: 'popup',
  });
}

try {
  chrome.runtime.onMessage.addListener((message) => {
    if (message === 'runAlarmsAnNotifications') {
      const mockAlarm = {
        name: '19h40 às 20h - Fechamento | Zoom @@@ https://trybe.zoom.us/j/97400302016',
      };
      fireAlarm(mockAlarm);
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
