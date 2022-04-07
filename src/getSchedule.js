/* eslint-disable no-param-reassign */
/* global chrome */
function getLastScheduleDay() {
  // const BLOCK_KIT_RENDER = document.getElementsByClassName('p-block_kit_renderer__block_wrapper');
  const BLOCK_KIT_RENDER = document.getElementsByClassName('c-message_kit__labels');
  // c-message_kit__labels

  const QUEM_REAGUE_COM = /(Quem )([a-zA-ZÀ-ÿ |,]+)( reage com)/gmi;
  const REAAAAAGE = /Quem viu reaaaage!!!/gmi;

  const matchesQuem = (e) => e.innerText.match(QUEM_REAGUE_COM);
  const matchesReaa = (e) => e.innerText.match(REAAAAAGE);
  const includesFixed = (e) => e.innerText.includes('Fixado por');

  return Array.from(BLOCK_KIT_RENDER)
    .filter((e) => (matchesQuem(e) || matchesReaa(e)) && includesFixed(e)).at(-1);
}

function formatScheduleString(scheduleDayDiv) {
  const MANY_WHITE_SPACES = /\s\s\s\s+/;
  const NUMBER_OR_BRACKET = /^\d\d|^[[]/;
  const ZOOM_PATTERN = /(^ [|] Zoom)/gim;

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

function getAllAgendaStrings(scheduleDayDiv) {
  const allAgendaStrings = scheduleDayDiv.innerText.split('\n');

  const agendaStringsWhereIsZoom = allAgendaStrings.filter((schedule) => schedule.includes('zoom') || schedule.includes('Zoom'));
  return agendaStringsWhereIsZoom.map((zoomString) => zoomString.split('Zoom').at(0));
}

function getFamilyElements(element) {
  const brother = element.previousElementSibling || { innerText: 'TEXTO_INVÁLIDO' };
  const uncle = element.parentElement.previousElementSibling || { innerText: 'TEXTO_INVÁLIDO' };
  const grandUncle = element.parentElement.parentElement.previousElementSibling || { innerText: 'TEXTO_INVÁLIDO' };

  const family = [brother, uncle, grandUncle];

  return family;
}

function checkIfHaveLink(array, agenda) {
  return array.some((member) => {
    const firstCheck = member.innerText.includes(agenda[0]);
    const secondCheck = agenda[0].includes(member.innerText);

    return firstCheck || secondCheck;
  });
}

function getZoomLinks(scheduleDayDiv) {
  const aTags = [...scheduleDayDiv.getElementsByTagName('a')];
  const zoomLinks = [];

  const agendaStrBeforeZoom = getAllAgendaStrings(scheduleDayDiv);

  if (!agendaStrBeforeZoom[0]) return false;

  saveAllZoomLinkAsBackup(aTags);

  aTags.forEach((e) => {
    if (e.href.includes('zoom.us')) {
      const elements = getFamilyElements(e);
      const checkElements = checkIfHaveLink(elements, agendaStrBeforeZoom);

      if (checkElements) {
        agendaStrBeforeZoom.shift();
        zoomLinks.push(e.href);
      }
    }
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
  console.warn('-------------- INICIANDO TRYBE GET_SCHEDULE -------------');
  console.warn('-------------- INICIANDO TRYBE GET_SCHEDULE -------------');

  const lastScheduleDay = getLastScheduleDay();
  console.log('Agenda from Slack: ', lastScheduleDay);

  const trybeScheduleStr = formatScheduleString(lastScheduleDay);
  console.log('Hours of the day: ', trybeScheduleStr);

  const trybeScheduleZoomLinks = getZoomLinks(lastScheduleDay, trybeScheduleStr);
  console.log('Important Zoom links: ', trybeScheduleZoomLinks);

  if (!trybeScheduleZoomLinks) {
    chrome.storage.sync.set({ scheduleAndLinks: null });
    return null;
  }

  const scheduleAndLinks = joinScheduleWithLink(trybeScheduleStr, trybeScheduleZoomLinks);
  console.log('scheduleAndLinks: ', scheduleAndLinks);

  chrome.storage.sync.set({ scheduleAndLinks });

  console.warn('-------------- FECHANDO TRYBE GET_SCHEDULE -------------');
  console.warn('-------------- FECHANDO TRYBE GET_SCHEDULE -------------');
  return scheduleAndLinks;
}

try {
  main();
} catch (error) {
  console.log(error);
}
