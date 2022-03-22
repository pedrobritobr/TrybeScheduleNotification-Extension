/* global chrome */

const createTabela = (trybeSchedule) => {
  const tabela = document.getElementById('tabela');
  tabela.innerHTML = '';

  const tabelaTitle = document.createElement('p');
  tabelaTitle.innerText = 'Horários Trybe';

  tabela.appendChild(document.createElement('br'));

  trybeSchedule.forEach(({ schedule, zoomLink }) => {
    const spanTagHour = document.createElement('span');
    spanTagHour.innerText = schedule;
    tabela.appendChild(spanTagHour);
    if (zoomLink) {
      const spanTagZoom = document.createElement('span');
      spanTagZoom.innerText = zoomLink;
      tabela.appendChild(spanTagZoom);
    }
    tabela.appendChild(document.createElement('br'));
    tabela.appendChild(document.createElement('br'));
  });
};

try {
  const getTodaySchedule = document.getElementById('getTodaySchedule');

  getTodaySchedule.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let trybeSchedule = [];

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['getSchedule.js'],
    });

    chrome.alarms.create('Test1111', { when: Date.now() + 5000 });
    chrome.alarms.getAll((resp) => console.log('----------INDEX----------\n resp Alarms: ', resp));

    chrome.runtime.sendMessage('runAlarmsAnNotifications', () => {});

    chrome.storage.local.get(['scheduleAndLinks'], ({ scheduleAndLinks }) => {
      trybeSchedule = scheduleAndLinks;
    });

    setTimeout(() => createTabela(trybeSchedule), 1500);
  });
} catch (error) {
  console.log(error);
}
