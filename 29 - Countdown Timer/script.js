let countdown;
const timerDisplay = document.querySelector(".display__time-left");
const endTime = document.querySelector(".display__end-time");
const buttons = document.querySelectorAll("[data-time]");

function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);

  const now = Date.now(); // Static Method (不支援IE8)
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    // 計算剩餘的時間
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    // 停止倒數
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    // 顯示剩餘的時間
    displayTimeLeft(secondsLeft);
  }, 16); // 60FPS (1000/60)
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = String(seconds % 60).padStart(2, "0"); // 小於兩位補0 (ES8)
  const display = `${minutes}:${remainderSeconds}`;
  document.title = display;
  timerDisplay.textContent = display; // 比 innerHTML 安全
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  const minutes = end.getMinutes();
  endTime.textContent = `Be Back At ${adjustedHour}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
}

function startTimer() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

buttons.forEach((button) => button.addEventListener("click", startTimer));
document.customForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const mins = this.minutes.value;
  console.log(mins);
  timer(mins * 60);
  this.reset();
});
