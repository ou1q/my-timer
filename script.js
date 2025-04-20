// —— 一次性解锁 clickSound，让后续 pointerdown 立刻有声 —— 
const clickSound = document.getElementById('clickSound');
function unlockClick() {
  clickSound.play().then(()=>clickSound.pause()).catch(()=>{});
  window.removeEventListener('pointerdown', unlockClick);
}
window.addEventListener('pointerdown', unlockClick);

// 每个按钮“按下”就播放点击音
document.querySelectorAll('button').forEach(btn =>
  btn.addEventListener('pointerdown', () => {
    clickSound.currentTime = 0;
    clickSound.play().catch(()=>{});
  })
);

// script.js - 简化后的按钮版，修复默认背景与交互

document.addEventListener('DOMContentLoaded', () => {
  let timer = null, targetTime = null;

  const display       = document.getElementById('display');
  const alarm         = document.getElementById('alarm');
  const toggleBtn     = document.getElementById('toggleBtn');
  const settingsBtn   = document.getElementById('settingsToggle');
  const settingsPanel = document.getElementById('settingsPanel');
  const closeSettings = document.getElementById('closeSettings');
  const customModal   = document.getElementById('customModal');
  const confirmBtn    = document.getElementById('confirmCustom');
  const presetCustom  = document.getElementById('presetCustom');

  // 解锁铃声（pointerdown 解锁后再点击任何预设也能立刻响）
  function unlockAlarm() {
    alarm.play().then(()=>alarm.pause()).catch(()=>{});
  }
  toggleBtn.addEventListener('pointerdown', unlockAlarm);
  document.querySelectorAll('.presets-grid button')
          .forEach(b => b.addEventListener('pointerdown', unlockAlarm));

  // 更新显示
  function updateDisplay(sec) {
    const m = String(Math.floor(sec/60)).padStart(2,'0');
    const s = String(sec%60).padStart(2,'0');
    display.textContent = `${m}:${s}`;
  }

  // 每秒 tick
  function tick() {
    const diff = Math.ceil((targetTime - Date.now()) / 1000);
    if (diff <= 0) {
      clearInterval(timer);
      localStorage.removeItem('timerTarget');
      updateDisplay(0);
      alarm.play().catch(()=>{});
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
  toggleBtn.addEventListener('pointerdown', () => {
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

  // 恢复刷新后倒计时
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
  settingsBtn.addEventListener('pointerdown', () =>
    settingsPanel.classList.toggle('hidden')
  );
  closeSettings.addEventListener('pointerdown', () =>
    settingsPanel.classList.add('hidden')
  );

  // 背景切换
  document.querySelectorAll('.wall-item').forEach(el =>
    el.addEventListener('pointerdown', () => {
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

  // 皮肤切换：pointerdown 立刻切换并收起面板
  document.querySelectorAll('.skins button').forEach(btn => {
    btn.addEventListener('pointerdown', () => {
      const skin = btn.dataset.skin;
      const container = document.querySelector('.container');
      container.className = 'container skin-' + skin;

      document.querySelectorAll('.skins button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      settingsPanel.classList.add('hidden');
    });
  });

  // 预设按钮：pointerdown 启动计时或弹框
  document.querySelectorAll('.presets-grid button').forEach(btn =>
    btn.addEventListener('pointerdown', () => {
      document.querySelectorAll('.presets-grid button').forEach(b => b.classList.remove('selected'));
      if (btn === presetCustom) {
        customModal.classList.remove('hidden');
        return;
      }
      btn.classList.add('selected');
      startTimer(parseFloat(btn.dataset.minutes));
    })
  );

  // Custom 模态框
  confirmBtn.addEventListener('pointerdown', () => {
    const m = parseInt(document.getElementById('customMinModal').value, 10);
    if (!m || m <= 0) return;
    customModal.classList.add('hidden');
    presetCustom.textContent = m + 'm';
    document.querySelectorAll('.presets-grid button').forEach(b => b.classList.remove('selected'));
    presetCustom.classList.add('selected');
    startTimer(m);
  });

  console.log('✅ 修订版加载完成，所有 click → pointerdown');
});
