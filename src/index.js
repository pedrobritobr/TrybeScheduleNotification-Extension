/* global chrome */

// AUXILIAR FUNCTIONS
function createZoomLinkElement(zoomLink) {
  const aLinkZoom = document.createElement('a');
  aLinkZoom.innerText = 'Zoom';
  aLinkZoom.href = zoomLink;
  aLinkZoom.title = zoomLink;
  aLinkZoom.target = '_blank';
  aLinkZoom.rel = 'noreferrer noopener';

  return aLinkZoom;
}

function returnTimestamp({ scheduleHour = 0, scheduleMinute = 0 }) {
  const mes = new Date().getMonth();
  const dia = new Date().getDate();
  const ano = new Date().getFullYear();

  return Date.UTC(ano, mes, dia, (+scheduleHour) + 3, (+scheduleMinute) - 2);
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

// MAIN FUNCTIONS
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
  const githublogo = document.getElementById('github-logo');

  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'dark');
    chrome.storage.sync.set({ datatheme: 'dark' });
    githublogo.src = '../images/icons/github-white-svgrepo-com.svg';
  } else {
    githublogo.src = '../images/icons/github-black-svgrepo-com.svg';
    document.documentElement.setAttribute('data-theme', 'light');
    chrome.storage.sync.set({ datatheme: 'light' });
  }
}

/*
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
*/

async function reloadScheduleSaved() {
  const { datatheme } = await chrome.storage.sync.get('datatheme');
  document.documentElement.setAttribute('data-theme', datatheme);
  const githublogo = document.getElementById('github-logo');

  if (datatheme === 'light') {
    githublogo.src = '../images/icons/github-black-svgrepo-com.svg';
  } else {
    githublogo.src = '../images/icons/github-white-svgrepo-com.svg';
  }

  const { scheduleAndLinks } = await chrome.storage.sync.get(['scheduleAndLinks']);
  if (scheduleAndLinks) createTabela(scheduleAndLinks);
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
          alerta(`Horários não encontrado, recarregue o slack e já para o momento da agenda.
          Se o erro persistir, entre em contato com Pedro Brito :)
          `);
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
