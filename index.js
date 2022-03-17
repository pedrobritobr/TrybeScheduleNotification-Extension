const clique = document.getElementById('clique');
let trybeSchedule = [];

const fullToday = new Date();

const mes = fullToday.getMonth();
const dia = fullToday.getDate();
const ano = fullToday.getFullYear();

const onlyToday = new Date(ano, mes, dia, 1, 21, 0);
// console.log('onlyToday: ', onlyToday);

const alarmV = Date.parse(onlyToday);
// console.log('alarmV: ', alarmV);

// chrome.alarms.create('Test', {when: Date.now() + 8000})  
// chrome.alarms.onAlarm.addListener(
//   () => {
//     alert('deu bom');
//   }
// )

function createTabela() {
  const tabela = document.getElementById('tabela');
  tabela.innerHTML = '';

  const tabelaTitle = document.createElement('p');
  tabelaTitle.innerText = 'Horários Trybe';

  tabela.appendChild(document.createElement('br'));

  trybeSchedule.forEach(({ schedule, zoomLink }) => {
    console.log('INDEX item: ', { schedule, zoomLink })
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
}

clique.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['background.js']
  });

  await chrome.storage.local.get(["scheduleAndLinks"], ({ scheduleAndLinks }) => {
    trybeSchedule = scheduleAndLinks;
    // chrome.tabs.sendMessage(tab.id, { name });
  });

  setTimeout(createTabela, 1500);

  // chrome.scripting.executeScript({
  //   target: { tabId: tab.id },
  //   function: setPageBackgroundColor,
  // });
});

// // The body of this function will be executed as a content script inside the
// // current page
// function setPageBackgroundColor() {
//   chrome.storage.sync.get("color", ({ color }) => {
//     document.body.style.backgroundColor = color;
//   });
// }

