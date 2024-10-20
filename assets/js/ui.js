// user actions

HELPERS.getPlayBtn().addEventListener('click', function(){
  if( isRunning ) {
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
  if(currentLevel < defaultBlindsData.length - 1) {
    HELPERS.getPlayBtn().querySelector('i').classList.add('fa-play');
    HELPERS.getPlayBtn().querySelector('i').classList.remove('fa-pause');
    clearInterval(timerInterval);
    updateLevel(++currentLevel);
    getLevel();
    localStorage.setItem('timeRemaining', (defaultBlinds[currentLevel].time * 60));
    // timeRemaining = parseInt( localStorage.getItem('timeRemaining') );
    initTimer( parseInt( localStorage.getItem('timeRemaining') ) );
    setBreakTimer();
    localStorage.setItem('timeToBreak', timeToBreak);
    timeRemaining = defaultBlindsData[currentLevel].time * 60 - 1;
  }
  console.log(onBreak);
});

HELPERS.getPrevBtn().addEventListener('click', function(){
  isRunning = false;
  if(currentLevel > 0) {
    HELPERS.getPlayBtn().querySelector('i').classList.add('fa-play');
    HELPERS.getPlayBtn().querySelector('i').classList.remove('fa-pause');
    clearInterval(timerInterval);
    updateLevel(--currentLevel);
    getLevel();
    localStorage.setItem('timeRemaining', (defaultBlinds[currentLevel].time * 60));
    initTimer( localStorage.getItem('timeRemaining') );
    setBreakTimer();
    localStorage.setItem('timeToBreak', timeToBreak);
  } else if (currentLevel == 0) {
    HELPERS.getPlayBtn().querySelector('i').classList.add('fa-play');
    HELPERS.getPlayBtn().querySelector('i').classList.remove('fa-pause');
    clearInterval(timerInterval);
    localStorage.setItem('timeRemaining', (defaultBlinds[currentLevel].time * 60));
    initTimer( localStorage.getItem('timeRemaining') );
    setBreakTimer();
    localStorage.setItem('timeToBreak', timeToBreak);
  }
  console.log(onBreak);
});

HELPERS.getResetBtn().addEventListener('click', function(){
  if (window.confirm("Are you sure you want to reset timer? This will remove all players, restart the rounds, and cannot be undone.")) {
    resetTournament();
  } else {}
  
});

HELPERS.getMenuBtn().addEventListener('click', function(){
  HELPERS.getMenu().classList.add('active');
});

HELPERS.getCloseBtn().addEventListener('click', function(){
  HELPERS.getMenu().classList.remove('active');
  closeMenuPanels();
});

HELPERS.getLevelsMenuLink().addEventListener('click', function(){
  HELPERS.getLevelSubmenu().classList.add('active');
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

  playerEl = buildPlayerEl(playerList.length);  

  HELPERS.getPlayerActionRow().before( playerEl );
});

HELPERS.getSeatingOpenBtn().addEventListener('click', function() {

  HELPERS.getSeatingPanel().classList.add('active');

  // tableCount = JSON.parse( localStorage.getItem( 'tableCount' ) );

  // if ( tableCount ) { 
  //   shuffledList = JSON.parse( localStorage.getItem( 'playerList' ) );
  //   displaySeatingChart( tableCount, shuffledList );
  //  }

});

HELPERS.getSeatingCloseBtn().addEventListener('click', function() {

  HELPERS.getSeatingPanel().classList.remove('active');

});

HELPERS.getAssignSeatingBtn().addEventListener('click', function() {

  assignSeats();

});