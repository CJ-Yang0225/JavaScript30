const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

let type = 2;

function switchType(num) {
  type = num;
}

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false
    })
    .then(mediaStream => {
      console.log(mediaStream);
      //   video.src = URL.createObjectURL(mediaStream); // deprecated
      video.srcObject = mediaStream;
      video.play();
    })
    .catch(error => {
      console.error(`ERROR: ${error}`);
    });
}

function paint2Canvas() {
  // 設置寬高
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  // getImageData 取得當前 canvas 中所有的像素點 (r,g,b,alpha)
  let pixels = ctx.getImageData(0, 0, width, height);

  // setInterval 間隔固定的時間後不斷重複。
  return setInterval(() => {
    // canvas 的來源為 video ，X、Y軸(寬高)與 video 相同，(0,0)到(width,height)
    ctx.drawImage(video, 0, 0, width, height);

    pixels = ctx.getImageData(0, 0, width, height);
    // pixels = redEffect(pixels);

    switch (type) {
      case 1:
        pixels = redEffect(pixels);
        break;
      case 2:
        pixels = rgbSplit(pixels);
        break;
      case 3:
        pixels = greenScreen(pixels);
        break;
    }
    ctx.clearRect(0, 0, width, height);
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // 將音效切到第0秒並播放（確保每次觸發的音效都正常）
  //   snap.currentTime = 0;
  //   snap.play();

  // HTMLCanvasElement.toDataURL() 回傳含有圖像和參數設置特定格式的 data URIs (base64)
  const data = canvas.toDataURL("image/jpeg");

  // 用 createElement 建立一個新的a元素
  const link = document.createElement("a");

  // 設置連結位置為轉圖檔後的base64位置
  link.href = data;

  // 設置連結的屬性(Attribute)
  link.setAttribute("download", "photo");

  // 連結內部新增一個預覽圖
  link.innerHTML = `<img src="${data}" alt="photo"/>`;

  // 在圖片區塞入新圖片。Node.insertBefore() 方法將一個節點安插在參考節點之前（在第一筆的位置），作為某個特定父節點之子節點。
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach(input => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    // 簡單判定消失的顏色
    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();
video.addEventListener("canplay", paint2Canvas);
