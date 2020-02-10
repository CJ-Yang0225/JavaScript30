const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll(".skip");
const ranges = player.querySelectorAll(".player__slider");

/* Build out functions */
function togglePlay() {
    // if (video.paused) {
    //     video.play();
    // } else {
    //     video.pause();
    // }

    /* 同上，先利用三元運算判斷方法 */
    const method = video.paused ? "play" : "pause";
    video[method](); // ☆ 物件使用中括號取Key值

    // updateButton()   // 更新畫面按鈕樣式，但會造成function耦合，不建議
}

function updateButton() {
    const icon = this.paused ? "►" : "❚ ❚";
    console.log(icon);
    toggle.textContent = icon;
}

function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    // volume, playbackRate
    // video.volume, video.playbackRate
    video[this.name] = this.value;
}

function handleProgress() {
    // duration為總時間
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

/* 影音播放器中，拖曳是相對複雜 */
function scrub(e) {
    // 滑鼠座標，觸控(touch)需另外做
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

/* Hook up the event listners */
video.addEventListener("click", togglePlay);
toggle.addEventListener("click", togglePlay);

video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);

video.addEventListener("timeupdate", handleProgress);

skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
// 連續觸發事件，畫面更新可能趕不上
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);

/* 較直覺寫法 */
// progress.addEventListener('mousemove', function(e) {
//     if (mousedown) {
//         scrub(e)
//     }
// })

// 同上，利用AND特性：前面通過才做後面
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));   

progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
