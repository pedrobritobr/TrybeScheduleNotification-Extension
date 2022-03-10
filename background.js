/* eslint-disable no-param-reassign */
//  background.js //
function formatScheduleString(elementsByTagName) {
  const agenda = 'AGENDA DO DIA |';

  const slackAgenda = Array.from(elementsByTagName)
    .filter((e) => e.innerHTML.includes(agenda)).at(-1);
  console.log('slackAgenda: ', slackAgenda);

  console.log('slackAgenda INNER TEXT: ', slackAgenda.innerText);

  const agendaStrings = slackAgenda.innerText.split('\n');

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

function main() {
  const P_RICH_TEXT_SECTION = document.getElementsByClassName('p-rich_text_section');

  const trybeSchedule = formatScheduleString(P_RICH_TEXT_SECTION);

  console.log('trybeSchedule: ', trybeSchedule);
}

main();
// \\wsl$\Ubuntu-20.04\home\brito\desktop\myproj