/* global chrome */

function createZoomLinkTaskATag(zoomLinkTask) {
  const zoomLinkTag = document.getElementById('zoomLink');
  zoomLinkTag.innerText = '';
  const aTagZoomLink = document.createElement('a');
  aTagZoomLink.innerText = zoomLinkTask;
  aTagZoomLink.href = zoomLinkTask;
  aTagZoomLink.target = '_blank';
  aTagZoomLink.rel = 'noreferrer noopener';
  zoomLinkTag.appendChild(aTagZoomLink);
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
  // const zoomLinkTask = 'https://trybe.zoom.us/j/97400302016';
  // const zoomLinkTask = '';

  createTaskNameH1Tag(taskName);
  if (zoomLinkTask) {
    createZoomLinkTaskATag(zoomLinkTask);
  } else {
    noZoomLink();
  }

  const alarme = new Audio('./bells.wav');
  alarme.volume = 0.2;
  alarme.play();
};
