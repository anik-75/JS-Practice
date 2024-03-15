const options = document.querySelectorAll('[type="range"]');
const skipButtons = document.querySelectorAll("[data-skip]");
const toggleButton = document.querySelector(".toggle");
const video = document.querySelector("video");
const progressBar = document.querySelector(".progress__filled");
const progress = document.querySelector(".progress");

function toggle() {
  const state = video.paused ? "play" : "pause";
  video[state]();
}
function updateButton() {
  const icon = video.paused ? "►" : "❚ ❚";
  toggleButton.textContent = icon;
}

function handleSkip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleOption() {
  video[this.name] = this.value;
}

function handleProgressBar() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const duration = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = duration;
}

video.addEventListener("click", toggle);
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
video.addEventListener("timeupdate", handleProgressBar);

skipButtons.forEach((skip) => skip.addEventListener("click", handleSkip));

options.forEach((option) => option.addEventListener("mousedown", handleOption));

progress.addEventListener("click", scrub);
let mousedown = false;
progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));
