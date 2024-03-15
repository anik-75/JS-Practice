const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

async function getVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  video.srcObject = stream;
  video.play();
}

function paintCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    // draw image => 16fps
    ctx.drawImage(video, 0, 0, width, height);

    // manipulate pixels
    let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // frame = chromaEffect(frame);
    frame = rgbSplit(frame);
    ctx.globalAlpha = 0.1;
    ctx.putImageData(frame, 0, 0);
  }, 16);
}

function takePhoto() {
  // play click sound
  snap.currentTime;
  snap.play();

  // get Frame
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = frame.data;

  // convert frame to  url
  data = canvas.toDataURL("image/jpeg");
  const anchor = document.createElement("a");
  anchor.href = data;
  anchor.setAttribute("download", "pic");
  anchor.innerHTML = `<img src=${data} alt=${"pic"}/>`;
  strip.insertBefore(anchor, strip.firstChild);
}

function chromaEffect(frame) {
  const pixels = frame.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const red = pixels[i + 0]; // r
    const green = pixels[i + 1]; // g
    const blue = pixels[i + 2]; // b
    if (green > 100 && red > 100 && blue < 43) {
      pixels[i + 3] = 0;
    }
  }
  return frame;
}
function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0];
    pixels.data[i + 500] = pixels.data[i + 1];
    pixels.data[i - 550] = pixels.data[i + 2];
  }
  return pixels;
}

video.addEventListener("canplay", paintCanvas);
getVideo();
