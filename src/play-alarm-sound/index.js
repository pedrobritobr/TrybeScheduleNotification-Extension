/* global chrome */

function createZoomLinkTaskATag(zoomLinkTask) {
  const zoomLinkTag = document.getElementById('zoomLink');
  const aTagZoomLink = document.createElement('a');
  aTagZoomLink.innerText = 'Zoom';
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
  console.log('taskInformation taskName: ', taskName);
  console.log('taskInformation zoomLinkTask: ', zoomLinkTask);

  createTaskNameH1Tag(taskName);
  if (zoomLinkTask) {
    createZoomLinkTaskATag(zoomLinkTask);
  } else {
    noZoomLink();
  }

  const alarme = new Audio('./bells2.wav');
  alarme.volume = 0.2;
  alarme.play();
};

// setTimeout(() => {
//   window.close();
// }, 7500);
