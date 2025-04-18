let totalSec = 0, timeLeft = 0, timer = null;
const display       = document.getElementById('display');
const faviconLink   = document.getElementById('favicon');
const alarm         = document.getElementById('alarm');
let selectedMinutes = null;

// 更新显示
function updateDisplay() {
  const m = String(Math.floor(timeLeft/60)).padStart(2,'0');
  const s = String(timeLeft%60).padStart(2,'0');
  display.textContent = `${m}:${s}`;
}

// 更新 favicon
function updateFavicon(progress) {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#eee';
  ctx.beginPath();
  ctx.arc(size/2,size/2,size/2-2,0,2*Math.PI);
  ctx.fill();
  ctx.fillStyle = '#ff6b6b';
  ctx.beginPath();
  ctx.moveTo(size/2,size/2);
  ctx.arc(size/2,size/2,size/2-2,-Math.PI/2,-Math.PI/2+2*Math.PI*progress);
  ctx.closePath();
  ctx.fill();
  faviconLink.href = canvas.toDataURL();
}

// 倒计时启动
function startTimerByMinutes(mins) {
  clearInterval(timer);
  totalSec = timeLeft = mins * 60;
  updateDisplay();
  updateFavicon(0);
  alarm.play().then(()=>alarm.pause()).catch(()=>{});
  document.getElementById('pauseBtn').disabled = false;
  document.getElementById('resetBtn').disabled = false;
  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();
    updateFavicon((totalSec - timeLeft)/totalSec);
    if (timeLeft <= 0) {
      clearInterval(timer);
      alarm.play();
      document.getElementById('pauseBtn').disabled = true;
    }
  }, 1000);
}

// 暂停 & 重置