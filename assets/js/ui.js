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


// Hotkeys for seating panel
document.addEventListener('keydown', function(e) {
  // Ignore key presses if user is typing in an input or textarea
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    return;
  }

  if (e.key === 's' || e.key === 'S') {
    // Open seating chart
    HELPERS.getSeatingPanel().classList.add('active');
  }

  if (e.key === 'Escape') {
    // Close seating chart
    HELPERS.getSeatingPanel().classList.remove('active');
  }
});


const seatingPanel = HELPERS.getSeatingPanel && HELPERS.getSeatingPanel();
if (seatingPanel) {
  seatingPanel.addEventListener('click', (e) => {
    const btn  = e.target.closest('button');
    const tile = e.target.closest('.tile[data-pid]');
    if (!btn || !tile) return;

    const pid = parseInt(tile.dataset.pid, 10);

    // --- Rebuy +/- (update UI inline, no re-render => no flicker) ---
    if (btn.classList.contains('s-plus') || btn.classList.contains('s-minus')) {
      e.preventDefault();
      const delta = btn.classList.contains('s-plus') ? +1 : -1;

      // persist
      rebuyByPid(pid, delta);

      // update the visible count in-place
      const countEl = tile.querySelector('.s-count');
      const before  = parseInt(countEl.textContent || '0', 10) || 0;
      const next    = Math.max(0, before + delta);
      countEl.textContent = next;

      btn.focus(); // keep hover tools visible
      return;
    }

    // --- Eliminate -> persist then re-render seating (removes from table) ---
    if (btn.classList.contains('s-elim')) {
      e.preventDefault();
      eliminateByPid(pid);

      const tc     = parseInt(localStorage.getItem('tableCount') || '0', 10);
      const seated = JSON.parse(localStorage.getItem('remainingPlayers') || '[]');
      if (tc) displaySeatingChart(tc, seated); // this also refreshes Busted column
      return;
    }
  });
}

// --- Drag & Drop (seats + busted) with custom drag image + single drop line preview ---
(function () {
  const seating = HELPERS.getSeatingPanel && HELPERS.getSeatingPanel();
  if (!seating) return;

  const MIME = 'application/x-pt';
  const asEl = (t) => (t instanceof Element) ? t : (t && t.parentElement) || null;

  // ===== Custom drag preview ("ghost") that matches the tile (name visible) =====
  let ghostEl = null;

  function createDragGhost(tileEl, e) {
    const rect = tileEl.getBoundingClientRect();

    // Clone only the .tile (avoid margins/borders from <li>)
    const ghost = tileEl.cloneNode(true);

    // Simplify the ghost preview (no hover controls/buttons)
    ghost.querySelector('.hover-controls')?.remove();

    // Copy key computed styles so the ghost looks identical
    const cs = getComputedStyle(tileEl);
    ghost.style.background   = cs.background;
    ghost.style.border       = cs.border;
    ghost.style.borderRadius = cs.borderRadius;
    ghost.style.padding      = cs.padding;
    ghost.style.color        = cs.color;
    ghost.style.font         = cs.font;
    ghost.style.lineHeight   = cs.lineHeight;

    // Isolate offscreen
    ghost.style.position = 'absolute';
    ghost.style.top = '0';
    ghost.style.left = '-9999px';
    ghost.style.margin = '0';
    ghost.style.inlineSize = Math.ceil(rect.width) + 'px';
    ghost.style.blockSize  = Math.ceil(rect.height) + 'px';
    ghost.style.pointerEvents = 'none';
    ghost.style.opacity = '0.98';
    ghost.style.boxShadow = '0 4px 10px rgba(0,0,0,.18)';

    document.body.appendChild(ghost);

    // Anchor the preview to the exact grab point
    const offX = e.clientX - rect.left;
    const offY = e.clientY - rect.top;

    try { e.dataTransfer.setDragImage(ghost, offX, offY); } catch {}

    ghostEl = ghost;
  }

  function destroyDragGhost() {
    if (ghostEl && ghostEl.parentNode) ghostEl.parentNode.removeChild(ghostEl);
    ghostEl = null;
  }

  // ===== Seats: highlight valid empty seats =====
  let lastSeatHL = null;
  function clearSeatHL() {
    if (lastSeatHL) lastSeatHL.classList.remove('drop-ok');
    lastSeatHL = null;
  }

  // ===== Busted: single drop line + index preview (no layout shift) =====
  const dropLine = document.createElement('div');
  dropLine.className = 'drop-line';
  let bustedIdxPreview = -1;

  function clearDropLine() {
    if (dropLine.parentNode) dropLine.parentNode.removeChild(dropLine);
    bustedIdxPreview = -1;
  }

  // Valid seat cell = has numeric table/seat
  const isSeatCell = (li) => {
    if (!li) return false;
    const t = parseInt(li.dataset.table, 10);
    const s = parseInt(li.dataset.seat, 10);
    return Number.isInteger(t) && Number.isInteger(s);
  };

  // Compute insertion index + visually centered Y between rows
  function computeBustedPreview(bl, clientY) {
    const items = Array.from(bl.querySelectorAll('li.seat.busted'));
    const listRect = bl.getBoundingClientRect();

    if (!items.length) return { idx: 0, y: 0 };

    // Decide gap by comparing to each row’s midpoint
    let idx = items.length; // default => after last
    for (let i = 0; i < items.length; i++) {
      const r = items[i].getBoundingClientRect();
      const mid = r.top + r.height / 2;
      if (clientY < mid) { idx = i; break; }
    }

    // Centered Y between above/below rows
    let y;
    if (idx === 0) {
      y = items[0].getBoundingClientRect().top - listRect.top; // before first
    } else if (idx === items.length) {
      y = items[items.length - 1].getBoundingClientRect().bottom - listRect.top; // after last
    } else {
      const aboveBottom = items[idx - 1].getBoundingClientRect().bottom;
      const belowTop    = items[idx].getBoundingClientRect().top;
      y = ((aboveBottom + belowTop) / 2) - listRect.top; // true midpoint
    }

    return { idx, y };
  }

  // ===== DRAG START: any .tile (from seats OR busted) =====
  seating.addEventListener('dragstart', (e) => {
    const el = asEl(e.target);
    if (!el) return;
    const tile = el.closest('.tile[data-pid]');
    if (!tile) return;

    const liSeat   = tile.closest('li.seat');
    const fromSeat = !!(liSeat && liSeat.classList.contains('occupied') && isSeatCell(liSeat));
    const payload  = {
      pid:    parseInt(tile.dataset.pid, 10),
      source: fromSeat ? 'seat' : 'busted',
      table:  fromSeat ? parseInt(liSeat.dataset.table, 10) : null,
      seat:   fromSeat ? parseInt(liSeat.dataset.seat, 10)  : null
    };

    // Some UAs restrict reading dataTransfer during 'dragover'; keep a local copy
    const json = JSON.stringify(payload);
    try { e.dataTransfer.setData(MIME, json); } catch {}
    try { e.dataTransfer.setData('text/plain', json); } catch {}
    e.dataTransfer.effectAllowed = 'move';

    // Mark source (optional CSS: .tile.dragging { opacity: .6; })
    tile.classList.add('dragging');

    // Custom drag image to prevent neighbor "bleed" and keep the name visible
    createDragGhost(tile, e);

    // Track payload for previews
    window.currentDrag = payload; // store on window to avoid closure confusion if desired
  });

  // ===== DRAG OVER: preview drop locations =====
  seating.addEventListener('dragover', (e) => {
    const el = asEl(e.target);
    if (!el) return;

    const currentDrag = window.currentDrag;

    // ---- Busted: show single drop line (no DOM reflow) ----
    if (el.closest('.busted-wrapper') && currentDrag?.source === 'busted') {
      const bl = el.closest('.busted-list');
      if (bl) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const { idx, y } = computeBustedPreview(bl, e.clientY);
        bustedIdxPreview = idx;

        if (dropLine.parentNode !== bl) {
          clearDropLine();
          bl.appendChild(dropLine);
        }
        dropLine.style.top = `${Math.round(y)}px`;
      }
      clearSeatHL();
      return;
    }

    // ---- Seats: highlight valid empty seats ----
    const slot = el.closest('.slot');
    if (slot) {
      const li = el.closest('.seat');
      if (isSeatCell(li) && !li.classList.contains('occupied')) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (lastSeatHL !== li) {
          clearSeatHL();
          li.classList.add('drop-ok');
          lastSeatHL = li;
        }
      } else {
        clearSeatHL();
      }
      return;
    }

    // Elsewhere: clear visuals
    clearSeatHL();
    clearDropLine();
  });

  // ===== DRAG LEAVE: tidy seat highlight when cursor leaves a seat =====
  seating.addEventListener('dragleave', (e) => {
    const el = asEl(e.target);
    if (!el) return;
    if (el.classList && el.classList.contains('seat')) {
      el.classList.remove('drop-ok');
      if (lastSeatHL === el) lastSeatHL = null;
    }
  });

  // ===== DROP: commit reorder (busted) or move/re-enroll (seats) =====
  seating.addEventListener('drop', (e) => {
    const el = asEl(e.target);
    if (!el) return;

    let payload = null;
    const raw = e.dataTransfer.getData(MIME) || e.dataTransfer.getData('text/plain');
    try { payload = JSON.parse(raw); } catch { payload = window.currentDrag || null; }
    if (!payload) return;

    // --- Commit reorder in Busted using previewed index ---
    if (el.closest('.busted-wrapper') && payload.source === 'busted') {
      const bl = el.closest('.busted-list');
      if (bl) {
        e.preventDefault();

        // Build current order and insert at preview index
        const items   = Array.from(bl.querySelectorAll('li.seat.busted'));
        const current = items.map(li => parseInt(li.dataset.pid, 10)).filter(Boolean);
        const next    = current.filter(id => id !== payload.pid);

        let idx = bustedIdxPreview;
        if (idx < 0) {
          // fallback if we somehow didn't preview
          const { idx: fallbackIdx } = computeBustedPreview(bl, e.clientY);
          idx = fallbackIdx;
        }
        idx = Math.max(0, Math.min(idx, next.length));
        next.splice(idx, 0, payload.pid);

        applyBustedOrder(next);
      }
      clearSeatHL();
      clearDropLine();
      destroyDragGhost();
      window.currentDrag = null;
      return;
    }

    // --- Seats (empty only, valid coordinates) ---
    const slot = el.closest('.slot');
    if (slot) {
      const li = el.closest('.seat');
      if (!isSeatCell(li) || li.classList.contains('occupied')) return;

      const table = parseInt(li.dataset.table, 10);
      const seat  = parseInt(li.dataset.seat, 10);

      if (payload.source === 'busted') {
        // Re-enroll directly into this exact seat
        reEnrollByPid(payload.pid, { autoSeat: false });
        seatPlayerAt(payload.pid, table, seat);
      } else if (payload.source === 'seat') {
        // Move seated player between tables
        moveSeat(payload.pid, table, seat);
      }

      const tc     = parseInt(localStorage.getItem('tableCount') || '0', 10);
      const seated = JSON.parse(localStorage.getItem('remainingPlayers') || '[]');
      if (tc) displaySeatingChart(tc, seated);
    }

    clearSeatHL();
    clearDropLine();
    destroyDragGhost();
    window.currentDrag = null;
  });

  // ===== DRAG END: clear any visuals =====
  seating.addEventListener('dragend', () => {
    clearSeatHL();
    clearDropLine();
    destroyDragGhost();
    // Remove source mark
    seating.querySelectorAll('.tile.dragging').forEach(t => t.classList.remove('dragging'));
    window.currentDrag = null;
  });
})();
