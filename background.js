/* eslint-disable no-param-reassign */
function getLastScheduleDay() {
  const BLOCK_KIT_RENDER = document.getElementsByClassName('p-block_kit_renderer__block_wrapper');

  const QUEM_REAGUE_COM = /(quem\s[a-z]+)( |, )(reage com)/img;

  return Array.from(BLOCK_KIT_RENDER)
    .filter((e) => e.innerText.match(QUEM_REAGUE_COM)).at(-1);
}

function formatScheduleString(scheduleDayDiv) {
  const MANY_WHITE_SPACES = /\s\s\s\s+/;
  const NUMBER_OR_BRACKET = /^\d\d|^[[]/;
  const ZOOM_PATTERN = /(^ [|] Zoom)|( [|] Zoom$)/gim;

  // MONTAR PADRÃO ZOOM
  const agendaStrings = scheduleDayDiv.innerText.split('\n');

  // BY REMOVING STRINGS WITH SPACES
  const scheduleTrybeNoSpaces = agendaStrings
    .filter((trybeString) => !trybeString.match(MANY_WHITE_SPACES));


  // JOIN ZOOM WITH TIME
  scheduleTrybeNoSpaces.forEach((e, index, baseArray) => {
    if (e.match(ZOOM_PATTERN)) {
      baseArray[index - 1] = baseArray[index - 1].concat(e.substring(1));
    }
  });

  return scheduleTrybeNoSpaces.filter((trybeString) => trybeString.match(NUMBER_OR_BRACKET));
}

function getZoomLinks(scheduleDayDiv) {
  const aTags = scheduleDayDiv.getElementsByTagName('a');
  const allAgendaStrings = scheduleDayDiv.innerText.split('\n');

  const agendaStringsWhereIsZoom = allAgendaStrings.filter((schedule) => schedule.includes('Zoom'));
  let agendaStrBeforeZoom = agendaStringsWhereIsZoom.map((zoomString) => zoomString.split('Zoom').at(0));

  const zoomLinks = [];
  
  Array.from(aTags).map((e) => {
    if (!agendaStrBeforeZoom[0]) return null;

    if (e.href.includes('zoom.us')) {
      const brother = e.previousElementSibling || { innerText: 'TEXTO_INVÁLIDO' };
      const uncle = e.parentElement.previousElementSibling || { innerText: 'TEXTO_INVÁLIDO' };
      const grandUncle = e.parentElement.parentElement.previousElementSibling || { innerText: 'TEXTO_INVÁLIDO' };

      const comparision1 = brother.innerText.includes(agendaStrBeforeZoom[0]);
      const comparision2 = agendaStrBeforeZoom[0].includes(brother.innerText) && brother.innerText;
      const comparision3 = uncle.innerText.includes(agendaStrBeforeZoom[0]);
      const comparision4 = agendaStrBeforeZoom[0].includes(uncle.innerText) && uncle.innerText;
      const comparision5 = grandUncle.innerText.includes(agendaStrBeforeZoom[0]);
      const comparision6 = agendaStrBeforeZoom[0].includes(grandUncle.innerText) && grandUncle.innerText;

      if (comparision1 || comparision2 || comparision3 || comparision4 || comparision5 || comparision6) {
        agendaStrBeforeZoom = agendaStrBeforeZoom.filter((_e, i) => i !== 0);
        zoomLinks.push(e.href);
        return null;
      };
    };
  });
  return zoomLinks;
}

function joinScheduleWithLink(trybeSchedule, zoomLinks) {
  const objSchedule = trybeSchedule.reduce((acc, schedule) => {
    const fullSchedule = { schedule };

    if (schedule.includes('Zoom')) {
      fullSchedule.zoomLink = zoomLinks[0];

      zoomLinks = zoomLinks.filter((_link, index) => index !== 0);
    }

    return [...acc, fullSchedule];
  }, []);

  return objSchedule;
}

function main() {
  console.log('-------------- INICIANDO APP -------------');
  console.log('-------------- INICIANDO APP -------------');
  const lastScheduleDay = getLastScheduleDay();
  console.log('slackAgenda: ', lastScheduleDay);

  const trybeScheduleStr = formatScheduleString(lastScheduleDay);
  const trybeScheduleZoomLinks = getZoomLinks(lastScheduleDay, trybeScheduleStr);
  const scheduleAndLinks = joinScheduleWithLink(trybeScheduleStr, trybeScheduleZoomLinks);

  console.log('trybeSchedule: ', trybeScheduleStr);
  console.log('trybeScheduleZoomLinks: ', trybeScheduleZoomLinks);
  console.log('scheduleAndLinks: ', scheduleAndLinks);

  chrome.storage.local.set({scheduleAndLinks});
  console.log('-------------- FECHANDO APP -------------');
  console.log('-------------- FECHANDO APP -------------');


  // console.log(Date.parse('04 Dec 3000 00:12:00 GMT'))
  // const unixTimeZero = Date.parse('01 Jan 1970 00:00:00 GMT');
  // const javaScriptRelease = Date.parse('04 Dec 3000 00:12:00 GMT');

  const fullToday = new Date();

  const mes = fullToday.getMonth();
  const dia = fullToday.getDate();
  const ano = fullToday.getFullYear();

  const onlyToday = new Date(ano, mes, dia, 0, 12, 0);
  console.log('onlyToday: ', onlyToday);

  const alarmV = Date.parse(onlyToday);
  console.log('alarmV: ', alarmV);

  // chrome.alarms.create('Test', {when: alarmV})
}

main();
