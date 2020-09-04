const outlineElem = document.querySelector('.clock-outline__moving circle');
const incElem = document.querySelector('.clock__inc');
const decElem = document.querySelector('.clock__dec');
const completeElem = document.querySelector('.controller__complete');
const playPauseElem = document.querySelector('.controller__playpause');
const resetElem = document.querySelector('.controller__reset');
const timerElem = document.querySelector('.clock__time');
const mediaPlayPauseElem = document.querySelector('.media-player__playpause');
const mediaMutedElem = document.querySelector('.media-player__muted');
const songElem = document.querySelector('.song');
const taskElem = document.querySelector('.task__title');

// Timer Outline
const outlineLength = outlineElem.getTotalLength();
outlineElem.style.strokeDasharray = outlineLength;
outlineElem.style.strokeDashoffset = outlineLength;

// Playing Song
const playSong = song => {
  if (song.paused) {
    song.play();
    mediaPlayPauseElem.innerHTML = playPauseElem.innerHTML = '';
    mediaPlayPauseElem.innerHTML = playPauseElem.innerHTML = `<i class="im im-pause"></i>`;
    return;
  }
  song.pause();
  mediaPlayPauseElem.innerHTML = playPauseElem.innerHTML = '';
  mediaPlayPauseElem.innerHTML = playPauseElem.innerHTML = `<i class="im im-play"></i>`;
};
mediaPlayPauseElem.addEventListener('click', () => playSong(songElem));
playPauseElem.addEventListener('click', () => playSong(songElem));

// Tomato Time
let duration = 25 * 60;
incElem.addEventListener('click', () => {
  if (songElem.paused) return;
  duration += 5 * 60;
});
decElem.addEventListener('click', () => {
  if (songElem.paused) return;
  if (duration - 5 * 60 > 0) duration -= 5 * 60;
});

songElem.ontimeupdate = () => {
  const currentTime = songElem.currentTime;
  const elapsed = duration - currentTime;
  const seconds = Math.floor(elapsed % 60);
  const minutes = Math.floor(elapsed / 60);
  const formatSec = seconds < 10 ? '0' + seconds : seconds;
  const formatMin = minutes < 10 ? '0' + minutes : minutes;

  const progress = outlineLength - (currentTime / duration) * outlineLength;
  outlineElem.style.strokeDashoffset = progress;
  timerElem.textContent = `${formatMin}:${formatSec}`;

  const completedTimer = () => {
    songElem.pause();
    mediaPlayPauseElem.innerHTML = playPauseElem.innerHTML = '';
    mediaPlayPauseElem.innerHTML = playPauseElem.innerHTML = `<i class="im im-play"></i>`;
    songElem.currentTime = 0;
    duration = 25 * 60;
  };

  if (currentTime > duration) {
    completedTimer();
  }

  completeElem.addEventListener('click', completedTimer);
  resetElem.addEventListener('click', () => {
    songElem.pause();
    songElem.currentTime = 0;
    songElem.play();
  });

  if (songElem.currentTime == 0) timerElem.textContent = '25:00';
};

const muteSong = song => {
  if (song.muted) {
    song.muted = false;
    mediaMutedElem.innerHTML = '';
    mediaMutedElem.innerHTML = `<i class="im im-volume"></i>`;
    return;
  }
  song.muted = true;
  mediaMutedElem.innerHTML = '';
  mediaMutedElem.innerHTML = `<i class="im im-volume-off"></i>`;
};
mediaMutedElem.addEventListener('click', () => muteSong(songElem));

// Storing and Retrieving Task Data
taskElem.addEventListener('change', e => {
  localStorage.setItem('task', e.target.value);
});

taskElem.value = localStorage.getItem('task');
