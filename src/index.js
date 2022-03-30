/* global chrome */

function createZoomLinkElement(zoomLink) {
  const aLinkZoom = document.createElement('a');
  aLinkZoom.innerText = 'Zoom';
  aLinkZoom.href = zoomLink;
  aLinkZoom.target = '_blank';
  aLinkZoom.rel = 'noreferrer noopener';

  return aLinkZoom;
}

const createTabela = (trybeSchedule) => {
  const tabela = document.getElementById('tabela');
  tabela.style.display = 'flex';
  tabela.innerHTML = '';

  const tabelaTitle = document.createElement('p');
  tabelaTitle.innerText = 'Horários Trybe';

  trybeSchedule.forEach(({ schedule, zoomLink }) => {
    const divForSchedule = document.createElement('div');
    divForSchedule.className = 'schedule';
    const pTagHour = document.createElement('p');
    pTagHour.innerText = schedule;
    divForSchedule.appendChild(pTagHour);
    if (zoomLink) {
      divForSchedule.appendChild(createZoomLinkElement(zoomLink));
    }
    tabela.appendChild(divForSchedule);
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

function switchTheme() {
  const { theme } = document.querySelector('html').dataset;

  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'dark');
    chrome.storage.sync.set({ datatheme: 'dark' });
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    chrome.storage.sync.set({ datatheme: 'light' });
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

async function reloadScheduleSaved() {
  const { datatheme } = await chrome.storage.sync.get('datatheme');
  document.documentElement.setAttribute('data-theme', datatheme);

  const { scheduleAndLinks } = await chrome.storage.sync.get(['scheduleAndLinks']);
  if (scheduleAndLinks) createTabela(scheduleAndLinks);
}

async function editSchedule() {
  const tabela = document.querySelector('#tabela');
  const divsSchedule = document.querySelectorAll('.schedule');

  if (divsSchedule[0].lastChild.localName !== 'input') {
    const { allZoomLinks } = await chrome.storage.sync.get(['allZoomLinks']);

    const allZoomLinksDiv = document.createElement('div');
    allZoomLinksDiv.id = 'allZoomLinks';

    allZoomLinks.forEach((zoomLink) => {
      const zoomElement = createZoomLinkElement(zoomLink);
      zoomElement.innerText = zoomLink;
      allZoomLinksDiv.appendChild(zoomElement);
      allZoomLinksDiv.appendChild(document.createElement('br'));
    });

    tabela.insertAdjacentElement('beforebegin', allZoomLinksDiv);

    console.log('divsSchedule: ', divsSchedule);

    Array.from(divsSchedule).forEach((schedule) => {
      if (schedule.lastChild.href) schedule.lastChild.remove();

      const zoomLinkInput = document.createElement('input');
      zoomLinkInput.placeholder = 'https://trybe.zoom.us/j/99999999999';
      schedule.appendChild(zoomLinkInput);
    });
  }
}

try {
  window.onload = reloadScheduleSaved();

  document.querySelector('#switch-input').addEventListener('click', switchTheme);
  const getTodaySchedule = document.getElementById('getTodaySchedule');
  // const editTodaySchedule = document.getElementById('editTodaySchedule');

  // editTodaySchedule.addEventListener('click', editSchedule);

  getTodaySchedule.addEventListener('click', async () => {
    const allZoomLinks = document.querySelector('#allZoomLinks');
    if (allZoomLinks) {
      allZoomLinks.remove();
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

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

    reloadScheduleSaved();

    // chrome.runtime.sendMessage('runAlarmsAnNotifications');

    return null;
  });
} catch (error) {
  console.log(error);
}
