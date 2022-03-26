/* eslint-disable no-param-reassign */
/* global chrome */
async function savedAlarms() {
  console.log('------ savedAlarms  ------');
  console.log('HORA AGORA: ', Date());
  console.log('HORA EPOCH: ', Date.now());
  console.log('await chrome.alarms.getAll(): ', await chrome.alarms.getAll());
}

async function fireAlarm(actualAlarm) {
  const [title, zoomLink = 'reminder'] = actualAlarm.name.split('@@@');
  const popupHeight = 300;
  const popupWidth = 500;

  const monitors = await chrome.system.display.getInfo();
  console.log('MONITOOOR: ', monitors[1]);

  const { bounds: pMonitor } = monitors.find((monitor) => monitor.isPrimary);
  // const { workArea: pMonitor } = monitors.find((monitor) => monitor.isPrimary);
  const {
    height: monitorHeight,
    width: monitorWidth,
  } = pMonitor;

  console.log('monitorHeight: ', monitorHeight);
  console.log('monitorWidth: ', monitorWidth);

  // await chrome.system.display.getInfo().then(
  //   (monitors) => {
  //     monitorHeight = bounds.height;
  //     monitorWidth = bounds.width;
  //   },
  // );
  // chrome.system.display.getInfo(
  //   flags?: GetInfoFlags,
  //   callback?: function,
  // )

  // console.log('height: ', monitorHeight);
  // console.log('width: ', monitorWidth);

  // savedAlarms();
  chrome.windows.create({
    url: './src/play-alarm-sound/index.html',
    height: popupHeight,
    width: popupWidth,
    left: (monitorWidth / 2) - (popupWidth / 2),
    top: (monitorHeight / 2) - (popupHeight),
    // top: (monitorHeight / 2) - (popupHeight / 2),
    // focused: false,
    type: 'popup',
    // state: 'minimized',
  });

  // const thereIs = 'There is a zoom link\n***CLICK ME***';
  // const thereIsNot = 'There is NOT a zoom link';
  // const notfMessage = zoomLink.includes('zoom.us') ? thereIs : thereIsNot;
  // const notifName = zoomLink;

  // chrome.windows.create({
  //   url: './src/play-alarm-sound/index.html',
  // });
/*
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
*/
}

try {
  chrome.runtime.onMessage.addListener((message) => {
    if (message === 'runAlarmsAnNotifications') {
      // console.log('window: ', window);
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
