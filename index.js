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

const createTabela = (trybeSchedule) => {
  console.log('trybeSchedule: ', trybeSchedule);
  // const tabela = document.getElementById('tabela');
  // tabela.innerHTML = '';

  // // const audioAlarm = new Audio('alarm.wav');
  // // audioAlarm.play();

  // console.log(Notification.permission);

  // const tabelaTitle = document.createElement('p');
  // tabelaTitle.innerText = 'Horários Trybe';

  // tabela.appendChild(document.createElement('br'));

  // trybeSchedule.forEach(({ schedule, zoomLink }) => {
  //   console.log('INDEX item: ', { schedule, zoomLink });
  //   const spanTagHour = document.createElement('span');
  //   spanTagHour.innerText = schedule;
  //   tabela.appendChild(spanTagHour);
  //   if (zoomLink) {
  //     const spanTagZoom = document.createElement('span');
  //     spanTagZoom.innerText = zoomLink;
  //     tabela.appendChild(spanTagZoom);
  //   }
  //   tabela.appendChild(document.createElement('br'));
  //   tabela.appendChild(document.createElement('br'));
  // });
};

try {
  const clique = document.getElementById('clique');

  clique.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let trybeSchedule = [];

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['getSchedule.js'],
    });

    chrome.storage.local.get(['scheduleAndLinks'], ({ scheduleAndLinks }) => {
      trybeSchedule = scheduleAndLinks;
    });

    setTimeout(() => createTabela(trybeSchedule), 1500);
  });
} catch (error) {
  console.log(error);
}
