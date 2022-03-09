//// background.js ////
function main() {
  const p_rich_text_section = document.getElementsByClassName('p-rich_text_section');
  const agenda = 'AGENDA DO DIA |'
  
  const slackAgenda = Array.from(p_rich_text_section)
    .filter((element) => element.innerHTML.includes(agenda)).at(-1);
  console.log('slackAgenda: ', slackAgenda);

  console.log('slackAgenda INNER TEXT: ', slackAgenda.innerText);

  let regex = /\d\d[a-zA-Z]\d\d\s-\s[a-zA-Z]/

  const x = slackAgenda.getElementsByTagName('b');
  const y = Array.from(x).filter(e => regex.test(e.innerHTML));
  console.log('y: ', y);
}

main();
// \\wsl$\Ubuntu-20.04\home\brito\desktop\myproj