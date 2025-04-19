// script.js —— 持久化倒计时，刷新也不重置
document.addEventListener('DOMContentLoaded', () => {
  let timer = null;
  let targetTime = null;   // 结束的时间戳（毫秒）

  const display   = document.getElementById('display');
  const alarm     = document.getElementById('alarm');
  const toggleBtn = document.getElementById('toggleBtn');
  const settingsBtn   = document.getElementById('settingsToggle');
  const settingsPanel = document.getElementById('settingsPanel');
  const customModal   = document.getElementById('customModal');
  const confirmBtn    = document.getElementById('confirmCustom');
  const presetCustom  = document.getElementById('presetCustom');

  // updateDisplay：把 timeLeft 秒数格式化到页面
  function updateDisplay(timeLeft) {
    const m = String(Math.floor(timeLeft/60)).padStart(2,'0');
    const s = String(timeLeft%60).padStart(2,'0');
    display.textContent = `${m}:${s}`;
  }

  // 计算剩余秒数，并在到 0 时停止
  function tick() {
    const now = Date.now();
    const diff = Math.ceil((targetTime - now)/1000);
    if (diff <= 0) {
      clearInterval(timer);
      targetTime = null;
      localStorage.removeItem('timerTarget');
      updateDisplay(0);
      alarm.play();
      toggleBtn.textContent = '▶️';
    } else {
      updateDisplay(diff);
    }
  }

  // 启动倒计时：minutes 分钟
  function startTimer(minutes) {
    // 计算结束时刻
    targetTime = Date.now() + minutes*60*1000;
    // 存进 localStorage
    localStorage.setItem('timerTarget', targetTime);
    // 马上跑一次并显示“暂停”状态
    tick();
    toggleBtn.textContent = '⏸️';
    // 清除旧的 interval
    clearInterval(timer);
    timer = setInterval(tick, 1000);
  }

  // ▶️/⏸️ 按钮
  toggleBtn.addEventListener('click', () => {
    if (timer) {
      // 暂停
      clearInterval(timer);
      timer = null;
      toggleBtn.textContent = '▶️';
    } else if (targetTime) {
      // 恢复
      toggleBtn.textContent = '⏸️';
      timer = setInterval(tick, 1000);
    }
  });

  // 加载时检查 localStorage，看之前有没有未完成的计时
  const saved = localStorage.getItem('timerTarget');
  if (saved) {
    targetTime = parseInt(saved, 10);
    if (Date.now() < targetTime) {
      // 直接进入倒计时状态
      tick();
      toggleBtn.textContent = '⏸️';
      timer = setInterval(tick, 1000);
    } else {
      // 如果已经过了结束时间，就清掉
      localStorage.removeItem('timerTarget');
      targetTime = null;
    }
  }

  // 设置面板开关
  settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
  });

  // 背景切换
  document.querySelectorAll('#settingsPanel button[data-wall]')
    .forEach(b => b.addEventListener('click', () => {
      document.body.className = 'wallpaper-' + b.dataset.wall;
    }));

  // 皮肤切换
  document.querySelectorAll('#settingsPanel button[data-skin]')
    .forEach(b => b.addEventListener('click', () => {
      document.querySelector('.container').className =
        'container skin-' + b.dataset.skin;
    }));

  // 8 格预设：点即启动或打开 Custom
  document.querySelectorAll('.presets-grid button').forEach(btn => {
    btn.addEventListener('click', () => {
      // 清除高亮
      document.querySelectorAll('.presets-grid button')
        .forEach(b=>b.classList.remove('selected'));

      if (btn === presetCustom) {
        customModal.classList.remove('hidden');
        return;
      }
      const mins = parseFloat(btn.dataset.minutes);
      btn.classList.add('selected');
      startTimer(mins);
    });
  });

  // Custom 输入分钟并启动
  confirmBtn.addEventListener('click', () => {
    const m = parseInt(document.getElementById('customMinModal').value,10);
    if (!m || m <= 0) return;
    customModal.classList.add('hidden');

    // 高亮 Custom
    document.querySelectorAll('.presets-grid button')
      .forEach(b=>b.classList.remove('selected'));
    presetCustom.textContent = m + 'm';
    presetCustom.classList.add('selected');

    startTimer(m);
  });

  console.log('📦 脚本已加载：支持刷新后继续倒计时。');
});
