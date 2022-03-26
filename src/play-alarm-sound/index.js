/* global chrome */

window.onload = async () => {
  const { taskInformation } = await chrome.storage.sync.get('taskInformation');
  // const { taskName, zoomLinkTask } = await chrome.storage.sync.get('taskInformation');
  const { taskName, zoomLinkTask } = taskInformation;
  // console.log('taskInformation: ', taskInformation);

  console.log('taskInformation taskName: ', taskName);
  console.log('taskInformation zoomLinkTask: ', zoomLinkTask);

  const taskTag = document.getElementById('task');
  const zoomLinkTag = document.getElementById('zoomLink');

  taskTag.innerText = taskName;
  zoomLinkTag.innerText = 'Zoom';
  zoomLinkTag.href = zoomLinkTask;
  zoomLinkTag.target = '_blank';
  zoomLinkTag.rel = 'noreferrer noopener';

  console.log('task: ', taskTag);
  console.log('zoomLink: ', zoomLinkTag);

  const alarme = new Audio('./bells2.wav');
  alarme.volume = 0.2;
  alarme.play();
};

// setTimeout(() => {
//   window.close();
// }, 7500);
