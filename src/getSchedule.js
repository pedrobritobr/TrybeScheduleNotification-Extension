/* eslint-disable no-param-reassign */
/* global chrome */
function getLastScheduleDay() {
  const BLOCK_KIT_RENDER = document.getElementsByClassName('p-block_kit_renderer__block_wrapper');

  const QUEM_REAGUE_COM = /(Quem )([a-zA-ZÀ-ÿ |,]+)( reage com)/gmi;
  const REAAAAAGE = /Quem viu reaaaage!!!/gmi;

  return Array.from(BLOCK_KIT_RENDER)
    .filter((e) => e.innerText.match(QUEM_REAGUE_COM) || e.innerText.match(REAAAAAGE)).at(-1);
}

function formatScheduleString(scheduleDayDiv) {
  const MANY_WHITE_SPACES = /\s\s\s\s+/;
  const NUMBER_OR_BRACKET = /^\d\d|^[[]/;

  // MONTAR PADRÃO ZOOM
  const agendaStrings = scheduleDayDiv.innerText.split('\n');

  const joinHourWithNextString = agendaStrings.map((str, index) => {
    const matches = str.match(NUMBER_OR_BRACKET);
    if (matches) {
      return `${matches.input}${agendaStrings[index + 1]}`;
    }
    return '';
  });

  // BY REMOVING STRINGS WITH SPACES
  return joinHourWithNextString
    .filter((trybeString) => {
      if (trybeString.length > 2) {
        return !trybeString.match(MANY_WHITE_SPACES);
      }
      return false;
    });
}

function saveAllZoomLinkAsBackup(aTags) {
  const allZoomLinks = Array.from(aTags)
    .filter((anchor) => anchor.href.includes('zoom.us')).map((e) => e.href);

  chrome.storage.sync.set({ allZoomLinks });
}

function getZoomLinks(scheduleDayDiv, trybeEventsDay) {
  const aTags = [...scheduleDayDiv.getElementsByTagName('a')];
  const zoomLinks = [];

  console.log('trybeEventsDay: ', trybeEventsDay);
  const trybeEventsDayWithZoom = trybeEventsDay.filter((event) => event.includes('oom'));

  saveAllZoomLinkAsBackup(aTags);

  aTags.forEach((e) => {
    if (e.href.includes('zoom.us')) {
      console.log('e.previousElementSibling.innerText: ', e.previousElementSibling.innerText);
      console.log('trybeEventsDayWithZoom[0]: ', trybeEventsDayWithZoom[0]);
      const firstCheck = e.previousElementSibling.innerText.includes(trybeEventsDayWithZoom[0]);
      const secondCheck = trybeEventsDayWithZoom[0].includes(e.previousElementSibling.innerText);
      if (firstCheck || secondCheck) {
        trybeEventsDayWithZoom.shift();
        zoomLinks.push(e.href);
      }
    }
  });

  return zoomLinks;
}

function joinScheduleWithLink(trybeSchedule, zoomLinks) {
  const objSchedule = trybeSchedule.reduce((acc, schedule) => {
    const fullSchedule = { schedule };

    if (schedule.includes('oom')) {
      fullSchedule.zoomLink = zoomLinks.at(0);
      zoomLinks.shift();
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

  const trybeEventsDay = formatScheduleString(lastScheduleDay);
  console.log('Hours of the day: ', trybeEventsDay);

  const trybeScheduleZoomLinks = getZoomLinks(lastScheduleDay, trybeEventsDay);
  console.log('Important Zoom links: ', trybeScheduleZoomLinks);

  if (!trybeScheduleZoomLinks) {
    chrome.storage.sync.set({ scheduleAndLinks: null });
    return null;
  }

  const scheduleAndLinks = joinScheduleWithLink(trybeEventsDay, trybeScheduleZoomLinks);
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
