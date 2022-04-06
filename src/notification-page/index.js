/* global chrome */
function createZoomLinkBtn() {
  const btnZoomLink = document.createElement('button');
  btnZoomLink.innerText = 'link do zoom';
  btnZoomLink.id = 'zoomLinkBtn';
  btnZoomLink.addEventListener('click', () => window.close());
  return btnZoomLink;
}

function aTag(zoomLinkTask) {
  const aTagZoomLink = document.createElement('a');
  aTagZoomLink.href = zoomLinkTask;
  aTagZoomLink.target = '_blank';
  aTagZoomLink.rel = 'noreferrer noopener';

  aTagZoomLink.appendChild(createZoomLinkBtn());
  return aTagZoomLink;
}

function createZoomLinkTaskATag(zoomLinkTask) {
  const zoomLinkTag = document.getElementById('zoomLink');
  zoomLinkTag.innerText = '';

  zoomLinkTag.appendChild(aTag(zoomLinkTask));
  return null;
}

function noZoomLink() {
  const zoomLinkTag = document.getElementById('zoomLink');
  zoomLinkTag.innerText = 'Não há link do zoom';
}

function createTaskNameH1Tag(taskName) {
  const taskTag = document.getElementById('task');
  taskTag.innerText = taskName;
}

window.onload = async () => {
  const { taskInformation } = await chrome.storage.sync.get('taskInformation');
  const { taskName, zoomLinkTask } = taskInformation;
  // const taskName = '19h40 às 20h - Fechamento | Zoom';
  // const zoomLinkTask = 'https://trybe.zoom.us/j/97927284204?pwd=dkp5SWttTWdFQjZZQTc0Qy8yZ1FWUT09';
  // const zoomLinkTask = '';

  createTaskNameH1Tag(taskName);
  if (zoomLinkTask) {
    createZoomLinkTaskATag(zoomLinkTask);
  } else {
    noZoomLink();
  }

  const alarme = new Audio('./bells.wav');
  alarme.volume = 0.4;
  alarme.play();
};

setTimeout(() => {
  window.close();
}, 29700);
