// user actions

HELPERS.getPlayBtn().addEventListener('click', function(){
  if( isRunning ) {
    pauseTimer();
    // audioTimer.pause(); - fix this edge case
    isRunning = false;
    getTimeRemaining();

  } else {
    timeRemaining = getTimeRemaining();

    startTimer(timeRemaining - 1);

    // if( !timeRemaining == defaultBlindsData[currentLevel].time * 60 ) {
    //   startTimer(timeRemaining - 1); // subtracting 1 to offset initial interval
    //   if(audioTimer.paused) { setTimeout(() => {
    //     audioTimer.play();
    //   }, 1000);  }
    // } else {
    //   startTimer(defaultBlindsData[currentLevel].time * 60 - 1); // subtracting 1 to offset initial interval 
    // }

    isRunning = true;

  }
  this.querySelector('i').classList.toggle('fa-play');
  this.querySelector('i').classList.toggle('fa-pause');
});

HELPERS.getNextBtn().addEventListener('click', function(){
  isRunning = false;
  if(currentLevel < defaultBlindsData.length - 1) {
    HELPERS.getPlayBtn().classList.add('fa-play');
    HELPERS.getPlayBtn().classList.remove('fa-pause');
    clearInterval(timerInterval);
    updateLevel(++currentLevel);
    getLevel();
    localStorage.setItem('timeRemaining', (defaultBlinds[currentLevel].time * 60));
    initTimer();
    timeRemaining = defaultBlindsData[currentLevel].time * 60 - 1;
  }
});

HELPERS.getPrevBtn().addEventListener('click', function(){
  isRunning = false;
  if(currentLevel > 0) {
    HELPERS.getPlayBtn().classList.add('fa-play');
    HELPERS.getPlayBtn().classList.remove('fa-pause');
    clearInterval(timerInterval);
    updateLevel(--currentLevel);
    getLevel();
    localStorage.setItem('timeRemaining', (defaultBlinds[currentLevel].time * 60));
    initTimer();
    // timeRemaining = defaultBlindsData[currentLevel].time * 60 - 1;
  } else if (currentLevel == 0) {
    HELPERS.getPlayBtn().classList.add('fa-play');
    HELPERS.getPlayBtn().classList.remove('fa-pause');
    clearInterval(timerInterval);
    localStorage.setItem('timeRemaining', (defaultBlinds[currentLevel].time * 60));
    initTimer();
    // timeRemaining = defaultBlindsData[currentLevel].time * 60 - 1;
  }
});

HELPERS.getResetBtn().addEventListener('click', function(){
  if (window.confirm("Are you sure you want to restart this tournament?")) {
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