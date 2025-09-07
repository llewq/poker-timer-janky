// === Audio settings (tiny helper, persisted) ===
(function(){
const KEY = 'pt.settings.v1';
const defaults = { audio: { endOfLevel: true, warning: true, volume: 1 } };


function load(){
  try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY)||'{}')); }
  catch { return JSON.parse(JSON.stringify(defaults)); }
}

function save(state){ localStorage.setItem(KEY, JSON.stringify(state)); }

function deepGet(obj, path){ return path.split('.').reduce((o,k)=> (o && k in o)? o[k] : undefined, obj); }

function deepSet(obj, path, val){ const ks=path.split('.'); let cur=obj; for(let i=0;i<ks.length-1;i++){ cur[ks[i]] = cur[ks[i]] || {}; cur = cur[ks[i]]; } cur[ks.at(-1)] = val; }


const state = load();
window.AppSettings = {
  state,
  get: (p)=> deepGet(state, p),
  set: (p,v)=>{ deepSet(state, p, v); save(state); document.dispatchEvent(new CustomEvent('settings:changed', { detail: { path:p, val:v } })); }
};
})();


// === Wire up the #navAudio toggles ===
(function(){
  function renderBtn(btn){
    const on = !!AppSettings.get(btn.dataset.toggle);
    btn.setAttribute('aria-pressed', String(on));
    const i = btn.querySelector('i');
    if (i){ 
      i.classList.toggle('fa-toggle-on', on); i.classList.toggle('fa-toggle-off', !on); 
    }
  }
  function renderPanel(){ 
    document.querySelectorAll('#navAudio .settings-toggle[data-toggle]').forEach(renderBtn); 
  }
  function onClick(e){
    const btn = e.currentTarget; const path = btn.dataset.toggle; const next = !AppSettings.get(path);
    AppSettings.set(path, next); renderBtn(btn);
    if (next) document.dispatchEvent(new CustomEvent('audio:preview', { detail: { path } }));
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    renderPanel();
    document.querySelectorAll('#navAudio .settings-toggle[data-toggle]').forEach(btn=>{
      if(!btn.hasAttribute('role')) btn.setAttribute('role','switch');
      btn.addEventListener('click', onClick);
      btn.addEventListener('keydown', (ev)=>{ if(ev.key==='Enter' || ev.key===' '){ ev.preventDefault(); btn.click(); }});
    });
  });
  document.addEventListener('settings:changed', (e)=>{ if((e.detail.path||'').startsWith('audio.')) renderPanel(); });
})();

// user actions

HELPERS.getPlayBtn().addEventListener('click', function(){
  if (isRunning) {
    pauseTimer();
    // audioTimer.pause(); - fix this edge case
    isRunning = false;
    getTimeRemaining();
  } else {
    timeRemaining = getTimeRemaining();
    timeToBreak = getTimeToBreak();

    startTimer(timeRemaining, timeToBreak);

    isRunning = true;
  }
  this.querySelector('i').classList.toggle('fa-play');
  this.querySelector('i').classList.toggle('fa-pause');
});

HELPERS.getNextBtn().addEventListener('click', function(){
  isRunning = false;
  if (currentLevel < defaultBlindsData.length - 1) {
    HELPERS.getPlayBtn().querySelector('i').classList.add('fa-play');
    HELPERS.getPlayBtn().querySelector('i').classList.remove('fa-pause');
    clearInterval(timerInterval);
    updateLevel(++currentLevel);
    getLevel();
    // Use the editable levels from localStorage
    localStorage.setItem('timeRemaining', (defaultBlindsData[currentLevel].time * 60));
    initTimer(parseInt(localStorage.getItem('timeRemaining'), 10));
    setBreakTimer();
    localStorage.setItem('timeToBreak', timeToBreak);
    timeRemaining = defaultBlindsData[currentLevel].time * 60 - 1;
  }
});

HELPERS.getPrevBtn().addEventListener('click', function(){
  isRunning = false;
  if (currentLevel > 0) {
    HELPERS.getPlayBtn().querySelector('i').classList.add('fa-play');
    HELPERS.getPlayBtn().querySelector('i').classList.remove('fa-pause');
    clearInterval(timerInterval);
    updateLevel(--currentLevel);
    getLevel();
    localStorage.setItem('timeRemaining', (defaultBlindsData[currentLevel].time * 60));
    initTimer(parseInt(localStorage.getItem('timeRemaining'), 10));
    setBreakTimer();
    localStorage.setItem('timeToBreak', timeToBreak);
  } else if (currentLevel == 0) {
    HELPERS.getPlayBtn().querySelector('i').classList.add('fa-play');
    HELPERS.getPlayBtn().querySelector('i').classList.remove('fa-pause');
    clearInterval(timerInterval);
    localStorage.setItem('timeRemaining', (defaultBlindsData[currentLevel].time * 60));
    initTimer(parseInt(localStorage.getItem('timeRemaining'), 10));
    setBreakTimer();
    localStorage.setItem('timeToBreak', timeToBreak);
  }
});

HELPERS.getResetBtn().addEventListener('click', function(){
  if (window.confirm("Are you sure you want to reset timer? This will remove all players, restart the rounds, and cannot be undone.")) {
    resetTournament();
  } else {}
});

HELPERS.getExportBtn().addEventListener('click', function(){
  exportCSV();
});

HELPERS.getMenuBtn().addEventListener('click', function(){
  HELPERS.getMenu().classList.add('active');
});

HELPERS.getCloseBtn().addEventListener('click', function(){
  HELPERS.getMenu().classList.remove('active');
  closeMenuPanels();
});

// Levels panel: open + render editor
HELPERS.getLevelsMenuLink().addEventListener('click', function(){
  HELPERS.getLevelsSubmenu().classList.add('active');
  if (window.renderLevelsEditor) window.renderLevelsEditor();
});

HELPERS.getPlayersMenuLink().addEventListener('click', function(){
  HELPERS.getPlayersSubmenu().classList.add('active');
});

HELPERS.getCashMenuLink().addEventListener('click', function(){
  HELPERS.getCashSubmenu().classList.add('active');
});

HELPERS.getAudioMenuLink().addEventListener('click', function(){
  HELPERS.getAudioSubmenu().classList.add('active');
});

HELPERS.getBackBtns().forEach(backBtn => {
  backBtn.addEventListener('click', closeMenuPanels);
});

HELPERS.getAccordionBtns().forEach(button => {
  button.addEventListener('click', function(e){
    this.setAttribute('aria-expanded', `${!(this.getAttribute('aria-expanded') === 'true')}`);
  });
});

HELPERS.getAddPlayerBtn().addEventListener('click', function(){
  playerEl = buildPlayerEl(Date.now());
  // WIP - this function was started to swap add button for save/save-new buttons
  // updateAddPlayerUI();
  HELPERS.getPlayerActionRow().after(playerEl);
});

HELPERS.getSeatingOpenBtn().addEventListener('click', function() {
  HELPERS.getSeatingPanel().classList.add('active');
});

HELPERS.getSeatingCloseBtn().addEventListener('click', function() {
  HELPERS.getSeatingPanel().classList.remove('active');
});

HELPERS.getAssignSeatingBtn().addEventListener('click', function() {
  assignSeats();
});

// --- Skip +/- 30s buttons ---
if (HELPERS.getSkipForwardBtn) {
  const btn = HELPERS.getSkipForwardBtn();
  if (btn) btn.addEventListener('click', function () {
    if (typeof adjustTimerSeconds === 'function') adjustTimerSeconds(-30);
  });
}
if (HELPERS.getSkipBackBtn) {
  const btn = HELPERS.getSkipBackBtn();
  if (btn) btn.addEventListener('click', function () {
    if (typeof adjustTimerSeconds === 'function') adjustTimerSeconds(30);
  });
}
