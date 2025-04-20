// script.js - 简化后的按钮版，修复默认背景与交互

// 页面首个交互解锁 clickSound
function unlockClickSound() {
  clickSound.play().then(() => clickSound.pause()).catch(() => {});
  // 解绑自己，后续不必再解锁
  window.removeEventListener('pointerdown', unlockClickSound);
}
window.addEventListener('pointerdown', unlockClickSound);

console.log('clickSound 元素是：', document.getElementById('clickSound'));

document.addEventListener('DOMContentLoaded', () => {
  let timer=null, targetTime=null;
  const display       = document.getElementById('display');
  const alarm         = document.getElementById('alarm');
  const clickSound    = document.getElementById('clickSound');
  const toggleBtn     = document.getElementById('toggleBtn');
  const settingsBtn   = document.getElementById('settingsToggle');
  const settingsPanel = document.getElementById('settingsPanel');
  const closeSettings = document.getElementById('closeSettings');
  const customModal   = document.getElementById('customModal');
  const confirmBtn    = document.getElementById('confirmCustom');
  const presetCustom  = document.getElementById('presetCustom');

  console.log('clickSound 元素是：', document.getElementById('clickSound'));

  // 点击音效
  function playClick() { clickSound.currentTime=0; clickSound.play().catch(()=>{}); }
  document.querySelectorAll('button').forEach(b=>b.addEventListener('click', playClick));

  // 解锁铃声
  function unlockAlarm() { alarm.play().then(()=>alarm.pause()).catch(()=>{}); }
  toggleBtn.addEventListener('click', unlockAlarm);
  document.querySelectorAll('.presets-grid button').forEach(b=>b.addEventListener('click', unlockAlarm));

  // 更新显示
  function updateDisplay(sec) { display.textContent = `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`; }

  // 每秒
  function tick() {
    const diff= Math.ceil((targetTime-Date.now())/1000);
    if(diff<=0){ clearInterval(timer); localStorage.removeItem('timerTarget'); updateDisplay(0); alarm.play().catch(()=>{}); toggleBtn.textContent='▶️'; }
    else updateDisplay(diff);
  }

  // 启动
  function startTimer(mins){ targetTime=Date.now()+mins*60000; localStorage.setItem('timerTarget',targetTime); clearInterval(timer); tick(); toggleBtn.textContent='⏸️'; timer=setInterval(tick,1000);}  

  // ▶️/⏸️
  toggleBtn.addEventListener('click',()=>{
    if(timer){ clearInterval(timer); timer=null; toggleBtn.textContent='▶️'; }
    else if(targetTime){ tick(); toggleBtn.textContent='⏸️'; timer=setInterval(tick,1000); }
  });

  // 恢复
  const saved=localStorage.getItem('timerTarget');
  if(saved){ targetTime=parseInt(saved); if(Date.now()<targetTime){ tick(); toggleBtn.textContent='⏸️'; timer=setInterval(tick,1000); } else localStorage.removeItem('timerTarget'); }

  // 面板开关
  settingsBtn.addEventListener('click',()=>settingsPanel.classList.toggle('hidden')); closeSettings.addEventListener('click',()=>settingsPanel.classList.add('hidden'));

  // 背景按钮
  document.querySelectorAll('.wall-item').forEach(el=>el.addEventListener('click',()=>{
    document.querySelectorAll('.wall-item').forEach(i=>i.classList.remove('selected')); el.classList.add('selected'); document.body.className='wallpaper-'+el.dataset.wall; settingsPanel.classList.add('hidden');
  }));
  // 默认 bg2
  const def= document.querySelector('.wall-item[data-wall="bg2"]'); if(def){ def.classList.add('selected'); document.body.className='wallpaper-bg2'; }



  // 皮肤切换：点击就生效并收起面板
  document.querySelectorAll('.skins button').forEach(btn => {
    btn.addEventListener('pointerdown', () => {
      // 先播放点击音
      clickSound.currentTime = 0;
      clickSound.play().catch(()=>{});
  
      // 然后再切换皮肤逻辑
      const skin = btn.dataset.skin;
      const container = document.querySelector('.container');
      container.className = 'container skin-' + skin;
  
      document.querySelectorAll('.skins button')
        .forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      document.getElementById('settingsPanel')
        .classList.add('hidden');
    });
  });

  // 预设按钮
  document.querySelectorAll('.presets-grid button').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.presets-grid button').forEach(b=>b.classList.remove('selected'));
    if(btn===presetCustom){ customModal.classList.remove('hidden'); return; }
    btn.classList.add('selected'); startTimer(parseFloat(btn.dataset.minutes));
  }));

  // Custom
  confirmBtn.addEventListener('click',()=>{
    const m=parseInt(document.getElementById('customMinModal').value,10); if(!m||m<=0)return;
    customModal.classList.add('hidden'); presetCustom.textContent=m+'m'; document.querySelectorAll('.presets-grid button').forEach(b=>b.classList.remove('selected')); presetCustom.classList.add('selected'); startTimer(m);
  });

  console.log('✅ 修订版加载完成');
});