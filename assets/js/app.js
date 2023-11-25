/**
 * Adds default player list to local storage, if no local storage exists
 */

if( !localStorage.getItem('playerList') ) {

  localStorage.setItem('playerList', JSON.stringify(players));
}

/**
 * Adds default current level to local storage, if no local storage exists
*/

if( !localStorage.getItem('currentLevel') ) {
  localStorage.setItem('currentLevel', JSON.stringify(0));
}

/**
 * Adds default current level to local storage, if no local storage exists
*/

if( !localStorage.getItem('timeRemaining') ) {
  localStorage.setItem('timeRemaining', JSON.stringify(900));
}

/**
 * Adds default blinds to local storage, if no local storage exists
*/

if( !localStorage.getItem('defaultBlinds') ) {
  localStorage.setItem('defaultBlinds', JSON.stringify(defaultBlinds));
}



// get default blinds

let defaultBlindsData;

function getDefaultBlinds() {
  defaultBlindsData = JSON.parse(localStorage.getItem('defaultBlinds'));
}

getDefaultBlinds();

// get player list 

let playerList;

function getPlayerList() {
  playerList = JSON.parse(localStorage.getItem('playerList'));
}

getPlayerList();


// create initial player count - does not change as players are elimintated

let initialPlayerCount = 0;

if( !localStorage.getItem('initialPlayerCount') ) {
  initialPlayerCount = playerList.length;
} else {
  initialPlayerCount = JSON.parse(localStorage.getItem('initialPlayerCount'));
}

function updateInitialCount() {
  HELPERS.getInitialCountCont().textContent = initialPlayerCount;
  localStorage.setItem('initialPlayerCount', JSON.stringify(initialPlayerCount));
}

updateInitialCount();

// create remaining player count - updates when a player is eliminated or re-enters
let remainingPlayerCount = playerList.length;

if( !localStorage.getItem('remainingPlayerCount') ) {
  remainingPlayerCount = playerList.length;
} else {
  remainingPlayerCount = JSON.parse(localStorage.getItem('remainingPlayerCount'));
}

function updateRemainingCount() {
  HELPERS.getRemainingCountCont().textContent = remainingPlayerCount;
  localStorage.setItem('remainingPlayerCount', JSON.stringify(remainingPlayerCount));
}

updateRemainingCount();

// initialize existing player list

function buildPlayerListUI() {
  
  playerList.forEach(player => {
    player = buildPlayerEl(player.pid);
    HELPERS.getPlayerActionRow().before(player);
  });
}

buildPlayerListUI();

// build empty results

function buildEmptyResults() {
  
  let i = 0;
  while (i < playerList.length ) {
    let emptyResult = document.createElement('div');
    emptyResult.setAttribute('data-empty', true);
    emptyResult.classList.add('player');
    emptyResult.innerHTML = `<span class="field"></span>`;

    HELPERS.getPlayerResultsCont().append( emptyResult );
    i++;
  }
}

// add payout badges to results

function addPayoutBadges() {
  let emptyResults = HELPERS.getPlayerResultsCont().querySelectorAll('.player');
  let i = 0;
  
  while (i < payouts.length) {
    let tag = document.createElement('span');
    tag.classList.add('prize');
    tag.innerHTML =
    `<sup>$</sup>${ payouts[i] }`;

    emptyResults[i].querySelector('.field').append(tag);
    i++;
  }
}

// reset tournament

function resetTournament() {
  clearInterval(timerInterval);
  HELPERS.getPlayBtn().classList.add('fa-play');
  HELPERS.getPlayBtn().classList.remove('fa-pause');
  isRunning = false;
  localStorage.setItem('currentLevel', JSON.stringify( 0 ));
  getLevel();
  initTimer();
  timeRemaining = defaultBlindsData[currentLevel].time * 60 - 1;
}

// get level data

let currentLevel;

function getLevel() {
  currentLevel = JSON.parse(localStorage.getItem('currentLevel'));
}

getLevel();

// update level data

function updateLevel() {
  localStorage.setItem('currentLevel', JSON.stringify( currentLevel ));
}

// initialize timer - runs when app is loaded and at start of new round

function initTimer() {
  // setup timer to begin running the first level
  HELPERS.getLevelCont().textContent = defaultBlindsData[currentLevel].label;
  // HELPERS.getMinutesCont().textContent = defaultBlindsData[currentLevel].time;
  // HELPERS.getSecondsCont().textContent = '00';

  setTimer( localStorage.getItem('timeRemaining'));

  HELPERS.getSmallBlindCont().textContent = defaultBlindsData[currentLevel].sb ? defaultBlindsData[currentLevel].sb : '-';
  HELPERS.getBigBlindCont().textContent = defaultBlindsData[currentLevel].bb ? defaultBlindsData[currentLevel].bb : '-';
  HELPERS.getAnteCont().textContent = defaultBlindsData[currentLevel].ante ? defaultBlindsData[currentLevel].ante : '-';

  if( currentLevel < (defaultBlindsData.length - 1)) {
    HELPERS.getNextSmallBlindCont().textContent = defaultBlindsData[currentLevel + 1].sb ? defaultBlindsData[currentLevel + 1].sb : '-';
    HELPERS.getNextBigBlindCont().textContent = defaultBlindsData[currentLevel + 1].bb ? defaultBlindsData[currentLevel + 1].bb : '-';
    HELPERS.getNextAnteCont().textContent = defaultBlindsData[currentLevel + 1].ante ? defaultBlindsData[currentLevel + 1].ante : '-';
  } else {
    HELPERS.getNextSmallBlindCont().textContent = '-';
    HELPERS.getNextBigBlindCont().textContent = '-';
    HELPERS.getNextAnteCont().textContent = '-';
  }
}

initTimer();

// start timer

let timerInterval;
let isRunning = false;
let timeRemaining; // value in seconds expressed as integer

function setTimer(timeRemaining) {
  var minutes, seconds;
  minutes = parseInt(timeRemaining / 60, 10);
  seconds = parseInt(timeRemaining % 60, 10);
  seconds = seconds < 10 ? "0" + seconds : seconds;

  HELPERS.getMinutesCont().textContent = minutes;
  HELPERS.getSecondsCont().textContent = seconds;
}

function startTimer(timeRemaining) {

  isRunning = true;

  var minutes, seconds;
  timerInterval = setInterval(function () {
      minutes = parseInt(timeRemaining / 60, 10)
      seconds = parseInt(timeRemaining % 60, 10);

      // minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      HELPERS.getMinutesCont().textContent = minutes;
      HELPERS.getSecondsCont().textContent = seconds;

      
      if (timeRemaining == 59) {
        HELPERS.getAudioWarning().play();
      }
      
      if (timeRemaining == 3) {
        HELPERS.getAudioEndRound().play();
      }
      
      if (timeRemaining < 1) {
        clearInterval(timerInterval); // stops timer from progressing
        updateLevel(++currentLevel);
        getLevel();
        initTimer();
        timeRemaining = defaultBlindsData[currentLevel].time * 60 - 1;
        startTimer(timeRemaining);
      }

      --timeRemaining;
      localStorage.setItem('timeRemaining', timeRemaining);
  }, 1000);
}

// pause timer 

function pauseTimer() {

  isRunning = false;
  clearInterval(timerInterval);
}

// get time remaining from timer display

function getTimeRemaining() {
  // timeRemaining = parseInt( HELPERS.getMinutesCont().textContent) * 60 + parseInt( HELPERS.getSecondsCont().textContent);
  timeRemaining = localStorage.getItem('timeRemaining');
  return timeRemaining;
}



// build player

function buildPlayerEl( playerID ) {
  let pid, name;
  if( playerList[playerID] ) {
    pid = playerList[playerID].pid;
    name = playerList[playerID].name;
  } else {
    addPlayer(); // adds empty player
    pid = playerID;
    name = "";
  }

  let playerEl = document.createElement('div');
  playerEl.setAttribute('class', 'player-row');
  playerEl.setAttribute('data-player', pid );

  playerEl.innerHTML = 
  `<form action="">
    <div class="mover">
      <button><i class="fas fa-angle-up"></i></button>
      <button><i class="fas fa-angle-down"></i></button>
    </div>
    <div>
      <label for="player-${ pid }">Player Name</label>
      <input type="text" id="player-${ pid }" data-pid="${ pid }" name="Small Blind 1" value="${ name }">
    </div>
    <div class="delete">
      <button data-delete="${ pid }"><i class="fas fa-times"></i></button>
    </div>
  </form>`;


  playerEl.querySelector('input').addEventListener('focusout', updatePlayer );
  playerEl.querySelector('input').addEventListener('keypress', function(e) {
    
    if ( e.key === 'Enter' ) {
      e.preventDefault();
      updatePlayer();
    }
  });

  return playerEl;
}

// build player element to display in remaning/results containers

function buildPlayerResultEl( pid ) {
  let playerEl = document.createElement('div');
  playerEl.classList.add('player');
  playerEl.setAttribute('data-player', pid);

  playerEl.innerHTML = 
  `<span class="field"><span class="name">${ playerList[pid].name }</span></span>`

  return playerEl;
}



// create next eliminated player position

let nextEliminatedPosition = playerList.length;


// create prize pool

let prizePool = initialPlayerCount * 10;

let payouts = []; // array of payouts
let placesPaid = 1;

function updatePrizePool() {

  initialPlayerCount = localStorage.getItem('initialPlayerCount');
  prizePool = initialPlayerCount * 10;

  let payoutIndex;

  if ( initialPlayerCount <= 4 ) {
    payoutIndex = 0;
  } else {
    payoutIndex = initialPlayerCount - 4;
  }

  let numPayouts = defaultNumPayouts[payoutIndex];
  
  payouts = []; // empty array before re-populating

  placesPaid = numPayouts.placesPaid;
  
  let prizeValues;

  if ( numPayouts.placesPaid < 2 ) {
    prizeValues = [1];
  } else {
    prizeValues = defaultPrizes.filter(prize => {
      return prize.placesPaid === placesPaid;
    });
  }

  
  let payoutPrecentages;
  
  if (prizeValues[0] == 1 ) {
    payoutPrecentages = [1];
  } else {
    payoutPrecentages = prizeValues[0].prizes.sort();
  } 
  
  let pot = prizePool;
  
  for (let i = 0; i < payoutPrecentages.length; i++) {
    if (i < payoutPrecentages.length - 1) {
      let payout = payoutPrecentages[i];
      cashPayout = Math.round(payout * prizePool);
      payouts.push( cashPayout );
      pot = pot - cashPayout;
    } else {
      payouts.push( pot );
    }
  }

  payouts = payouts.reverse();

  return payouts;
}


// update average stack

let averageStack;

function updateAverageStack() {
  if ( initialPlayerCount > 0 && remainingPlayerCount > 0 ) {
    averageStack = Math.round(initialPlayerCount * 10000 / remainingPlayerCount);
  } else if ( initialPlayerCount > 0 && remainingPlayerCount == 0 ) {
    averageStack = initialPlayerCount * 10000;
  } else {
    averageStack = 0;
  }
  localStorage.setItem('averageStack', JSON.stringify( averageStack ));

  HELPERS.getAveargeStackCont().textContent = '$' + averageStack.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

updateAverageStack();

// update player in player list

function updatePlayer() {
  let pid = this.dataset.pid;
  let cleanName = DOMPurify.sanitize(this.value);

  playerList[pid].name = cleanName;
  this.value = cleanName;
  
  localStorage.setItem('playerList', JSON.stringify(playerList));

  updatePlayerResultsLists();
}

// add player to player list in localStorage

function addPlayer( ) {
  playerList.push({
    pid: playerList.length,
    active: true,
    name: "",
    placed: null
  });

  localStorage.setItem('playerList', JSON.stringify(playerList));

  initialPlayerCount++;
  remainingPlayerCount++;
  nextEliminatedPosition++;
  updateInitialCount();
  updateRemainingCount();
  updateAverageStack();
}

// delete player 

function deletePlayer( pid ) {
  remove = HELPERS.getPlayersMenu().querySelector(`[data-player='${ pid }']`);
  remove.remove();

  playerList.splice( pid, 1);

  renumberPlayers();

  localStorage.setItem('playerList', JSON.stringify( playerList ));

  initialPlayerCount--;
  remainingPlayerCount--;
  nextEliminatedPosition--;
  updateInitialCount();
  updateRemainingCount();
  updatePlayerResultsLists();
}

// renumber players 

function renumberPlayers() {
  i = 0;
  playerList.forEach(player => {
    player.pid = i;
    i++;
  });
}

// eliminate player



function eliminatePlayer() {
  pid = this.dataset.player;

  console.log(nextEliminatedPosition);
  
  playerList[pid].placed = nextEliminatedPosition;
  playerList[pid].active = false;
  localStorage.setItem('playerList', JSON.stringify(playerList));
  --nextEliminatedPosition;

  updatePlayerResultsLists();

  remainingPlayerCount--;
  updateRemainingCount();
  updateAverageStack();
}

// re-enroll player

function reEnrollPlayer() {
  pid = this.dataset.player;

  playerList[pid].active = true;
  playerList[pid].placed = null;
  localStorage.setItem('playerList', JSON.stringify(playerList));

  updatePlayerResultsLists();

  remainingPlayerCount++;
  nextEliminatedPosition++;
  updateRemainingCount();
  updateAverageStack();
}

// build blind level

function buildBlindLevel() {
  // build an empty html form field for a single blind level
}

// build break level 

function buildBreakLevel() {
  // build an empty html form field for a single break level
}

// build default blinds

function buildDefaultBlinds() {

}

// global

const allLinks = document.querySelectorAll('a');
allLinks.forEach(link => {
  link.addEventListener('click', function(e){
    e.preventDefault();
  });
});

const allButtons = document.querySelectorAll('form button');
allButtons.forEach(button => {
  button.addEventListener('click', function(e){
    e.preventDefault();
  });
});

const allForms = document.querySelectorAll('form');
allForms.forEach(form => {
  form.addEventListener('keypress', function(e){
    if( e.key === 'Enter') {  }
  });
});


function updatePlayerResultsLists() {
  HELPERS.getPlayerResultsCont().innerHTML = null;
  HELPERS.getPlayersRemainingCont().innerHTML = null;
  
  buildEmptyResults();
  
  playerList.forEach(player => {
    let playerEl = buildPlayerResultEl(player.pid);
    if ( player.active === false ) {
      playerEl.addEventListener('click', reEnrollPlayer);
      slots = HELPERS.getPlayerResultsCont().querySelectorAll('.player');
      slots[player.placed - 1].replaceWith(playerEl);
    } else {
      playerEl.addEventListener('click', eliminatePlayer);
      HELPERS.getPlayersRemainingCont().append(playerEl);
    }
  });

  updatePrizePool();

  if ( prizePool > 0 ) { addPayoutBadges(); }
}

updatePlayerResultsLists();




const deletePlayerBtns = HELPERS.getPlayersMenu().querySelectorAll('.delete button');

deletePlayerBtns.forEach(button => {
  button.addEventListener('click', function(e){
    let pid = e.target.parentElement.parentElement.parentElement.parentElement.dataset.player;
    
    if (window.confirm("Are you sure you want to delete this player?")) {
      deletePlayer( pid );
    } else {}
  });
});

function closeMenuPanels() {
  let panels = HELPERS.getMenuPanels();
  panels.forEach(panel => {
    panel.classList.remove('active');
  });
  
}
