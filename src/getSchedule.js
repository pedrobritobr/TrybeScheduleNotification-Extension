/* eslint-disable no-param-reassign */
/* global chrome */
function getLastScheduleDay() {
  const BLOCK_KIT_RENDER = document.getElementsByClassName('p-block_kit_renderer__block_wrapper');

  const QUEM_REAGUE_COM = /(Quem )([a-zA-ZÀ-ÿ |,]+)( reage com)/gmi;

  return Array.from(BLOCK_KIT_RENDER)
    .filter((e) => e.innerText.match(QUEM_REAGUE_COM)).at(-1);
}

function formatScheduleString(scheduleDayDiv) {
  const MANY_WHITE_SPACES = /\s\s\s\s+/;
  const NUMBER_OR_BRACKET = /^\d\d|^[[]/;
  const ZOOM_PATTERN = /(^ [|] Zoom)/gim;
  // const ZOOM_PATTERN = /(^ [|] Zoom)|( [|] Zoom$)/gim;

  // MONTAR PADRÃO ZOOM
  const agendaStrings = scheduleDayDiv.innerText.split('\n');

  // BY REMOVING STRINGS WITH SPACES
  const scheduleTrybeNoSpaces = agendaStrings
    .filter((trybeString) => {
      if (trybeString.length > 2) {
        return !trybeString.match(MANY_WHITE_SPACES);
      }
      return false;
    });

  // JOIN ZOOM WITH TIME
  scheduleTrybeNoSpaces.forEach((e, index, baseArray) => {
    if (e.match(ZOOM_PATTERN)) {
      baseArray[index - 1] = baseArray[index - 1].concat(e.substring(1));
    }
  });

  return scheduleTrybeNoSpaces.filter((trybeString) => trybeString.match(NUMBER_OR_BRACKET));
}

function saveAllZoomLinkAsBackup(aTags) {
  const allZoomLinks = Array.from(aTags)
    .filter((anchor) => anchor.href.includes('zoom.us')).map((e) => e.href);

  chrome.storage.sync.set({ allZoomLinks });
}

function getZoomLinks(scheduleDayDiv) {
  const aTags = scheduleDayDiv.getElementsByTagName('a');

  saveAllZoomLinkAsBackup(aTags);

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

      const comparison1 = brother.innerText.includes(agendaStrBeforeZoom[0]);
      const comparison2 = agendaStrBeforeZoom[0].includes(brother.innerText) && brother.innerText;
      const comparison3 = uncle.innerText.includes(agendaStrBeforeZoom[0]);
      const comparison4 = agendaStrBeforeZoom[0].includes(uncle.innerText) && uncle.innerText;
      const comparison5 = grandUncle.innerText.includes(agendaStrBeforeZoom[0]);
      const comparison6 = agendaStrBeforeZoom[0]
        .includes(grandUncle.innerText) && grandUncle.innerText;

      if (comparison1 || comparison2 || comparison3
        || comparison4 || comparison5 || comparison6) {
        agendaStrBeforeZoom = agendaStrBeforeZoom.filter((_e, i) => i !== 0);
        zoomLinks.push(e.href);
        return null;
      }
    }
    return null;
  });
  return zoomLinks;
}

function joinScheduleWithLink(trybeSchedule, zoomLinks) {
  const objSchedule = trybeSchedule.reduce((acc, schedule) => {
    const fullSchedule = { schedule };

    if (schedule.includes('Zoom')) {
      fullSchedule.zoomLink = zoomLinks.at(0);

      zoomLinks = zoomLinks.filter((_link, index) => index !== 0);
    }

    return [...acc, fullSchedule];
  }, []);

  return objSchedule;
}

function main() {
  console.log('-------------- INICIANDO TRYBE HOURS -------------');
  console.log('-------------- INICIANDO TRYBE HOURS -------------');

  const lastScheduleDay = getLastScheduleDay();
  console.log('Agenda from Slack: ', lastScheduleDay);

  const trybeScheduleStr = formatScheduleString(lastScheduleDay);
  console.log('Hours of the day: ', trybeScheduleStr);

  const trybeScheduleZoomLinks = getZoomLinks(lastScheduleDay, trybeScheduleStr);
  console.log('Important Zoom links: ', trybeScheduleZoomLinks);

  const scheduleAndLinks = joinScheduleWithLink(trybeScheduleStr, trybeScheduleZoomLinks);
  console.log('scheduleAndLinks: ', scheduleAndLinks);

  chrome.storage.sync.set({ scheduleAndLinks });

  console.log('-------------- FECHANDO TRYBE HOURS -------------');
  console.log('-------------- FECHANDO TRYBE HOURS -------------');
  return scheduleAndLinks;
}

try {
  main();
} catch (error) {
  console.log(error);
}
