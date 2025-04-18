// script.js - 最终版，修复自动打开 Custom 弹框问题

document.addEventListener('DOMContentLoaded', () => {
  let totalSec = 0,
      timeLeft = 0,
      timer    = null;

  const display      = document.getElementById('display');
  const alarm        = document.getElementById('alarm');
  const toggleBtn    = document.getElementById('toggleBtn');
  const settingsBtn  = document.getElementById('settingsToggle');
  const settingsPanel= document.getElementById('settingsPanel');
  const customModal  = document.getElementById('customModal');
  const confirmBtn   = document.getElementById('confirmCustom');
  const presetCustom = document.getElementById('presetCustom');

  // 1. 确保自定义弹框初始隐藏
  customModal.classList.add('hidden');

  // 2. 点击 ⚙️ 切换设置面板
  settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
  });

  // 3. 设置：切换背景
  document.querySelectorAll('#settingsPanel button[data-wall]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.className = 'wallpaper-' + btn.dataset.wall;
    });
  });

  // 4. 设置：切换皮肤
  document.querySelectorAll('#settingsPanel button[data-skin]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.container').className =
        'container skin-' + btn.dataset.skin;
    });
  });

  // 通用：更新显示
  function updateDisplay() {
    const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const s = String(timeLeft % 60).padStart(2, '0');
    display.textContent = `${m}:${s}`;
  }

  // 启动倒计时
  function startTimer(mins) {
    clearInterval(timer);
    totalSec = timeLeft = mins * 60;
    updateDisplay();
    // 解锁自动播放
    alarm.play().then(() => alarm.pause()).catch(() => {});
    toggleBtn.textContent = '⏸️';
    toggleBtn.disabled = false;

    timer = setInterval(() => {
      timeLeft--;
      updateDisplay();
      if (timeLeft <= 0) {
        clearInterval(timer);
        alarm.play();
        toggleBtn.textContent = '▶️';
      }
    }, 1000);
  }

  // ▶️/⏸️ 切换
  toggleBtn.addEventListener('click', () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      toggleBtn.textContent = '▶️';
    } else if (timeLeft > 0) {
      startTimer(timeLeft / 60);
    }
  });

  // 8 枚预设按钮：点即启动或打开 Custom
  document.querySelectorAll('.presets-grid button').forEach(btn => {
    btn.addEventListener('click', () => {
      // 清除高亮
      document.querySelectorAll('.presets-grid button').forEach(b => b.classList.remove('selected'));
      
      if (btn === presetCustom) {
        // 只在点击 Custom 时打开弹框
        customModal.classList.remove('hidden');
        return;
      }

      const mins = parseFloat(btn.dataset.minutes);
      btn.classList.add('selected');
      startTimer(mins);
    });
  });

  // Custom 弹框：点击开始，读取分钟并启动
  confirmBtn.addEventListener('click', () => {
    const input = document.getElementById('customMinModal');
    const mins  = parseInt(input.value, 10);
    if (!mins || mins <= 0) return;
    customModal.classList.add('hidden');

    // 高亮 Custom 按钮
    document.querySelectorAll('.presets-grid button').forEach(b => b.classList.remove('selected'));
    presetCustom.textContent = mins + 'm';
    presetCustom.classList.add('selected');

    startTimer(mins);
  });

  console.log('✅ 修正后脚本已加载，无需自动弹框。');
});