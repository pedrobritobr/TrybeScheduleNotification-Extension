/* eslint-disable no-param-reassign */
//  background.js //
function formatScheduleString(scheduleDayDiv) {
  console.log('slackAgenda INNER TEXT: ', scheduleDayDiv.innerText);

  const agendaStrings = scheduleDayDiv.innerText.split('\n');

  const MANY_WHITE_SPACES = /\s\s\s\s+/;
  const NUMBER_OR_BRACKET = /^\d|^[[]/;
  const ZOOM_WORD = /^\s[|]\s/;

  // BY REMOVING STRINGS WITH SPACES
  const scheduleTrybeNoSpaces = agendaStrings
    .filter((trybeString) => !trybeString.match(MANY_WHITE_SPACES));

  // JOIN ZOOM WITH TIME
  scheduleTrybeNoSpaces.forEach((e, index, baseArray) => {
    if (e.match(ZOOM_WORD)) {
      baseArray[index - 1] = baseArray[index - 1].concat(e.substring(1));
    }
  });

  const scheduleTrybe = scheduleTrybeNoSpaces
    .filter((trybeString) => trybeString.match(NUMBER_OR_BRACKET));

  console.log('scheduleTrybe: ', scheduleTrybe);
  return scheduleTrybe;
}

// function getZoomLinks(elementsByClassName) {
//   return elementsByClassName
// }

function getLastScheduleDay() {
  const P_RICH_TEXT_SECTION = document.getElementsByClassName('p-rich_text_section');
  const agenda = 'AGENDA DO DIA |';

  const slackAgenda = Array.from(P_RICH_TEXT_SECTION)
    .filter((e) => e.innerHTML.includes(agenda)).at(-1);
  console.log('slackAgenda: ', slackAgenda);

  return slackAgenda;
}

function main() {
  const lastScheduleDay = getLastScheduleDay();
  const trybeScheduleStr = formatScheduleString(lastScheduleDay);

  // const trybeScheduleZoomLinks = getZoomLinks(lastScheduleDay);

  console.log('trybeSchedule: ', trybeScheduleStr);
  // console.log('trybeScheduleZoomLinks: ', trybeScheduleZoomLinks);
}

main();

// \\wsl$\Ubuntu-20.04\home\brito\desktop\myproj
