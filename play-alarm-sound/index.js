window.onload = () => {
  const alarme = new Audio('./bells.mp3');
  alarme.volume = 0.2;
  alarme.play();
};

setTimeout(() => {
  window.close();
}, 7500);
