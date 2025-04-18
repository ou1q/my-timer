let totalSec = 0, remainingSec = 0, timerId = null;
const display = document.getElementById('display');
const faviconLink = document.getElementById('favicon');
const alarm = document.getElementById('alarm');

alarm.play().then(() => alarm.pause()).catch(() => {});

document.getElementById('startBtn').onclick = () => {
  const mins = parseInt(document.getElementById('minutes').value);
  if (isNaN(mins) || mins <= 0) return alert('请输入正整数分钟数');
  totalSec = remainingSec = mins * 60;
  updateBtns(true);
  tick();
  timerId = setInterval(tick, 1000);
};

document.getElementById('pauseBtn').onclick = () => {
  clearInterval(timerId);
  updateBtns(false);
};

document.getElementById('resetBtn').onclick = () => {
  clearInterval(timerId);
  remainingSec = totalSec;
  updateDisplay();
  updateFavicon(0);
  updateBtns(false, true);
};

function tick() {
  if (remainingSec <= 0) {
    clearInterval(timerId);
    alarm.play();
    updateBtns(false, true);
    return;
  }
  remainingSec--;
  updateDisplay();
  updateFavicon((totalSec - remainingSec) / totalSec);
}

function updateDisplay() {
  const m = String(Math.floor(remainingSec/60)).padStart(2,'0');
  const s = String(remainingSec%60).padStart(2,'0');
  display.textContent = `${m}:${s}`;
}

function updateBtns(running, resetDisabled=false) {
  document.getElementById('startBtn').disabled = running;
  document.getElementById('pauseBtn').disabled = !running;
  document.getElementById('resetBtn').disabled = !running && !resetDisabled;
}

// 动态生成 favicon
function updateFavicon(progress) {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  // 背景圆
  ctx.fillStyle = '#eee';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2 - 2, 0, 2 * Math.PI);
  ctx.fill();

  // 进度扇形
  ctx.fillStyle = '#ff6b6b';
  ctx.beginPath();
  ctx.moveTo(size/2, size/2);
  ctx.arc(size/2, size/2, size/2 - 2, -Math.PI/2, -Math.PI/2 + 2*Math.PI*progress);
  ctx.closePath();
  ctx.fill();

  faviconLink.href = canvas.toDataURL('image/png');
}

// 初始化显示
updateDisplay();
updateFavicon(0);