/* global chrome */

function aTag(zoomLinkTask) {
  const aTagZoomLink = document.createElement('a');
  aTagZoomLink.innerText = 'link do zoom';
  aTagZoomLink.href = zoomLinkTask;
  aTagZoomLink.target = '_blank';
  aTagZoomLink.rel = 'noreferrer noopener';
  return aTagZoomLink;
}

function createZoomLinkTaskATag(zoomLinkTask) {
  const zoomLinkTag = document.getElementById('zoomLink');
  zoomLinkTag.innerText = '';
  // const btn = document.createElement('button');

  // btn.innerText = 'link do zoom';
  // btn.appendChild(aTag(zoomLinkTask));
  // zoomLinkTag.appendChild(btn);
  zoomLinkTag.appendChild(aTag(zoomLinkTask));
  return null;
}

function noZoomLink() {
  const zoomLinkTag = document.getElementById('zoomLink');
  const thereIsNotLink = 'Não há link do zoom';

  zoomLinkTag.innerText = thereIsNotLink;
  return null;
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
}, 19700);
