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
