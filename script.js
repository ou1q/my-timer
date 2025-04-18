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

// 设置面板交互
const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel  = document.getElementById('settingsPanel');
settingsToggle.addEventListener('click', () => {
  settingsPanel.classList.toggle('hidden');
});

// 切换背景
document.querySelectorAll('#settingsPanel button[data-wall]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.body.className = 'wallpaper-' + btn.dataset.wall;
  });
});

// 切换皮肤
document.querySelectorAll('#settingsPanel button[data-skin]').forEach(btn => {
  btn.addEventListener('click', () => {
    const box = document.querySelector('.container');
    box.className = 'container skin-' + btn.dataset.skin;
  });
});

// 获取元素
const presets   = document.querySelectorAll('.presets button');
const customIn  = document.getElementById('customMinutes');
const customBtn = document.getElementById('customStart');

// 复用倒计时启动函数
function startTimerByMinutes(mins) {
  timeLeft = mins * 60;
  updateDisplay();
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();
    updateFavicon((totalSec - timeLeft) / totalSec);
    if (timeLeft <= 0) {
      clearInterval(timer);
      alarm.play();
    }
  }, 1000);
  totalSec = timeLeft;
}

// 预设按钮点击
presets.forEach(btn => {
  btn.addEventListener('click', () => {
    const mins = parseInt(btn.dataset.minutes, 10);
    startTimerByMinutes(mins);
  });
});

// 自定义按钮点击
customBtn.addEventListener('click', () => {
  const mins = parseInt(customIn.value, 10);
  if (!mins || mins <= 0) return alert('请输入有效分钟数');
  startTimerByMinutes(mins);
});