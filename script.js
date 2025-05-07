// script.js - 优化“按下触发音效，点击触发逻辑”，滑动不误触

// —— 一次性解锁 clickSound + alarmSound —— 
const clickSound = document.getElementById('clickSound');
const alarm      = document.getElementById('alarm');

function unlockMedia() {
  // 解锁点击音
  clickSound.play().then(()=>clickSound.pause()).catch(()=>{});
  // 解锁闹钟音
  alarm.play().then(()=>alarm.pause()).catch(()=>{});
  // 解绑自己
  window.removeEventListener('pointerdown', unlockMedia);
}

// 在用户第一次触摸时执行解锁
window.addEventListener('pointerdown', unlockMedia);

// —— 只给倒计时相关按钮绑定“按下”音效 —— 
const timerButtons = [
  '#toggleBtn',               // 播放/暂停
  '.presets-grid button',     // 30s/1m/…/Custom
  '#confirmCustom'            // Custom 弹框里的“开始”
];
timerButtons.forEach(sel =>
  document.querySelectorAll(sel).forEach(btn =>
    btn.addEventListener('pointerdown', () => {
      clickSound.currentTime = 0;
      clickSound.play().catch(()=>{});
    })
  )
);

// 主逻辑：DOM 加载完成后再绑定 click 事件触发真正操作

document.addEventListener('DOMContentLoaded', () => {
  let timer = null;
  let targetTime = null;

  const display       = document.getElementById('display');
  const toggleBtn     = document.getElementById('toggleBtn');
  const settingsBtn   = document.getElementById('settingsToggle');
  const settingsPanel = document.getElementById('settingsPanel');
  const closeSettings = document.getElementById('closeSettings');
  const customModal   = document.getElementById('customModal');
  const confirmBtn    = document.getElementById('confirmCustom');
  const presetCustom  = document.getElementById('presetCustom');

  // 更新显示
  function updateDisplay(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    display.textContent = `${m}:${s}`;
  }

  // 每秒 tick
  function tick() {
    const diff = Math.ceil((targetTime - Date.now()) / 1000);
    if (diff <= 0) {
      clearInterval(timer);
      localStorage.removeItem('timerTarget');
      updateDisplay(0);
      alarm.play().catch(() => {});
      toggleBtn.textContent = '▶️';
    } else {
      updateDisplay(diff);
    }
  }

  // 启动倒计时
  function startTimer(mins) {
    targetTime = Date.now() + mins * 60000;
    localStorage.setItem('timerTarget', targetTime);
    clearInterval(timer);
    tick();
    toggleBtn.textContent = '⏸️';
    timer = setInterval(tick, 1000);
  }

  // ▶️/⏸️ 切换
  toggleBtn.addEventListener('click', () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      toggleBtn.textContent = '▶️';
    } else if (targetTime) {
      tick();
      toggleBtn.textContent = '⏸️';
      timer = setInterval(tick, 1000);
    }
  });

  // 页面加载时恢复倒计时
  const saved = localStorage.getItem('timerTarget');
  if (saved) {
    targetTime = parseInt(saved, 10);
    if (Date.now() < targetTime) {
      tick();
      toggleBtn.textContent = '⏸️';
      timer = setInterval(tick, 1000);
    } else {
      localStorage.removeItem('timerTarget');
    }
  }

  // 设置面板开关
  settingsBtn.addEventListener('click', () =>
    settingsPanel.classList.toggle('hidden')
  );
  closeSettings.addEventListener('click', () =>
    settingsPanel.classList.add('hidden')
  );

  // 背景切换（click 触发）
  document.querySelectorAll('.wall-item').forEach(el =>
    el.addEventListener('click', () => {
      document.querySelectorAll('.wall-item').forEach(i => i.classList.remove('selected'));
      el.classList.add('selected');
      document.body.className = 'wallpaper-' + el.dataset.wall;
      settingsPanel.classList.add('hidden');
    })
  );
  // 默认 bg2
  const def = document.querySelector('.wall-item[data-wall="bg2"]');
  if (def) {
    def.classList.add('selected');
    document.body.className = 'wallpaper-bg2';
  }

  // 默认 Total Transparent 皮肤高亮
  const defSkin = document.querySelector('.skins button[data-skin="total-transparent"]');
  if (defSkin) defSkin.classList.add('selected');

  // 皮肤切换（click 触发）
  document.querySelectorAll('.skins button').forEach(btn => {
    btn.addEventListener('click', () => {
      const skin = btn.dataset.skin;
      const container = document.querySelector('.container');
      container.className = 'container skin-' + skin;

      document.querySelectorAll('.skins button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      settingsPanel.classList.add('hidden');
    });
  });

  // 预设按钮（click 触发）
  document.querySelectorAll('.presets-grid button').forEach(btn =>
    btn.addEventListener('click', () => {
      document.querySelectorAll('.presets-grid button').forEach(b => b.classList.remove('selected'));
      if (btn === presetCustom) {
        customModal.classList.remove('hidden');
        return;
      }
      btn.classList.add('selected');
      startTimer(parseFloat(btn.dataset.minutes));
    })
  );

  // Custom 输入确认（click 触发）
  confirmBtn.addEventListener('click', () => {
    const m = parseInt(document.getElementById('customMinModal').value, 10);
    if (!m || m <= 0) return;
    customModal.classList.add('hidden');
    presetCustom.textContent = m + 'm';
    document.querySelectorAll('.presets-grid button').forEach(b => b.classList.remove('selected'));
    presetCustom.classList.add('selected');
    startTimer(m);
  });

  console.log('✅ 更新完成：pointerdown 播音效，click 触发逻辑');
});