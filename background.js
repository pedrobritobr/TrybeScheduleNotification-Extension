/* eslint-disable no-param-reassign */
//  background.js //
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

  const zoomLinks = [];
  Array.from(aTags).forEach((e) => {
    if (e.href.includes('zoom.us')) {
      zoomLinks.push(e.href);
    }
  });

  return zoomLinks;
}

function getLastScheduleDay() {
  const BLOCK_KIT_RENDER = document.getElementsByClassName('p-block_kit_renderer__block_wrapper');
  const QUEM_REAGUE_COM = /(quem\s[a-z]+)( |, )(reage com)/img;

  const lastScheduleDay = Array.from(BLOCK_KIT_RENDER)
    .filter((e) => e.innerText.match(QUEM_REAGUE_COM)).at(-1);

  return lastScheduleDay;
}

function main() {
  const lastScheduleDay = getLastScheduleDay();
  console.log('slackAgenda: ', lastScheduleDay);

  const trybeScheduleStr = formatScheduleString(lastScheduleDay);
  const trybeScheduleZoomLinks = getZoomLinks(lastScheduleDay);

  console.log('trybeSchedule: ', trybeScheduleStr);
  console.log('trybeScheduleZoomLinks: ', trybeScheduleZoomLinks);
}

main();
