/* eslint-disable no-param-reassign */
/* global chrome */
async function fireAlarm({ name, scheduledTime }) {
  const TEN_SECONDS_AGO = Date.now() - 10000;

  if (TEN_SECONDS_AGO < scheduledTime) {
    const [taskName, zoomLinkTask] = name.split('@@@');
    const taskInformation = { taskName, zoomLinkTask };

    await chrome.storage.sync.set({ taskInformation });

    const popupHeight = 280;
    const popupWidth = 450;

    const monitors = await chrome.system.display.getInfo();
    const { bounds: pMonitor } = monitors.find((monitor) => monitor.isPrimary);
    const { height: monitorHeight, width: monitorWidth } = pMonitor;

    await chrome.windows.create({
      url: './src/notification-page/index.html',
      focused: true,
      height: popupHeight,
      width: popupWidth,
      left: (monitorWidth / 2) - (popupWidth / 2),
      top: (monitorHeight / 2) - (popupHeight),
      type: 'popup',
    });
  }
}

try {
  chrome.runtime.onMessage.addListener((message) => {
    if (message === 'runAlarmsAnNotifications') {
      const event = '19h40 às 20h - Fechamento | Zoom';
      const zoomLink = 'https://trybe.zoom.us/j/97927284204?pwd=dkp5SWttTWdFQjZZQTc0Qy8yZ1FWUT09';
      chrome.alarms.create(`${event} @@@ ${zoomLink}`, { when: Date.now() + 1000 });
      return true;
    }
    return false;
  });

  chrome.alarms.onAlarm.addListener(fireAlarm);
} catch (error) {
  console.log(error);
}
