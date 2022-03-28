/* global chrome */

const createTabela = (trybeSchedule) => {
  const tabela = document.getElementById('tabela');
  tabela.style.display = 'flex';
  tabela.innerHTML = '';

  const tabelaTitle = document.createElement('p');
  tabelaTitle.innerText = 'Horários Trybe';

  tabela.appendChild(document.createElement('br'));

  trybeSchedule.forEach(({ schedule, zoomLink }) => {
    const pTagHour = document.createElement('p');
    pTagHour.innerText = schedule;
    tabela.appendChild(pTagHour);
    if (zoomLink) {
      const aLinkZoom = document.createElement('a');
      aLinkZoom.innerText = 'Zoom';
      aLinkZoom.href = zoomLink;
      aLinkZoom.target = '_blank';
      aLinkZoom.rel = 'noreferrer noopener';
      tabela.appendChild(aLinkZoom);
    }
  });
};

function returnTimestamp({ scheduleHour = 0, scheduleMinute = 0 }) {
  const mes = new Date().getMonth();
  const dia = new Date().getDate();
  const ano = new Date().getFullYear();

  const dateString = new Date(ano, mes, dia, scheduleHour, (+scheduleMinute) - 2, 0);
  return Date.parse(dateString);
}

function createAlarm(eventTime, event, zoomLink) {
  if (eventTime > Date.now()) {
    if (zoomLink) {
      chrome.alarms.create(`${event} @@@ ${zoomLink}`, { when: eventTime });
    } else {
      chrome.alarms.create(`${event}`, { when: eventTime });
    }
  }
}

function getTrybeHours(trybeSchedule) {
  const REGEXX = /(\d\d[h])(\d\d|)/i;

  trybeSchedule.forEach(({ schedule, zoomLink }) => {
    const [scheduleHour, scheduleMinute] = REGEXX.exec(schedule).at(0).split('h');
    const scheduleTimestamp = returnTimestamp({ scheduleHour, scheduleMinute });
    createAlarm(scheduleTimestamp, schedule, zoomLink);
  });
}

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

function firstChildOfBody() {
  const pTag = document.createElement('p');

  pTag.innerText = 'Você está fora do slack!';
  pTag.id = 'outOfSlack';
  pTag.style['background-color'] = '#F5A8A8';
  pTag.style['font-size'] = '18px';
  pTag.style['text-align'] = 'center';

  const body = document.querySelector('body');
  const bodyFirstChild = body.firstChild;

  body.insertBefore(pTag, bodyFirstChild);
}

try {
  document.querySelector('#switch-input').addEventListener('click', switchTheme);
  const getTodaySchedule = document.getElementById('getTodaySchedule');

  getTodaySchedule.addEventListener('click', async () => {
    chrome.storage.sync.clear('scheduleAndLinks');

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    console.log('tab: ', tab);
    if (!tab.url.includes('app.slack.com')) {
      firstChildOfBody();
      return null;
    }

    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['./src/getSchedule.js'] });

    await chrome.storage.sync.get(
      ['scheduleAndLinks'],
      ({ scheduleAndLinks }) => {
        if (!scheduleAndLinks) {
          const alerta = window.alert;
          alerta('Horários não encontrado, recarregue o slack e já para o momento da agenda');
        } else {
          createTabela(scheduleAndLinks);
          getTrybeHours(scheduleAndLinks);
        }
      },
    );

    chrome.runtime.sendMessage('runAlarmsAnNotifications');

    return null;
  });
} catch (error) {
  console.log(error);
}
