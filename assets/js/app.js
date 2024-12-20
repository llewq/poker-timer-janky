/**
 * Adds default player list to local storage, if no local storage exists
 */

if( !localStorage.getItem('playerList') ) {

  localStorage.setItem('playerList', JSON.stringify(players));
}

/**
 * Adds default player list to local storage, if no local storage exists
 */

if( !localStorage.getItem('seating') ) {

  localStorage.setItem('seating', JSON.stringify(seating));
}

/**
 * Adds default player list to local storage, if no local storage exists
 */

if( !localStorage.getItem('remainingPlayers') ) {

  localStorage.setItem('remainingPlayers', JSON.stringify(remainingPlayers));
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


// create entry count - does not change as players are elimintated

let entryCount = 0;

if( !localStorage.getItem('entryCount') ) {
  entryCount = playerList.length;
} else {
  entryCount = JSON.parse(localStorage.getItem('entryCount'));
  entryCount = parseInt(entryCount, 10);
}

function updateEntryCount() {
  entryCount = parseInt(entryCount, 10);
  HELPERS.getEntryCountCont().textContent = entryCount;
  localStorage.setItem('entryCount', JSON.stringify(entryCount));
}

updateEntryCount();

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

// create an object that holds the names and ids of players still in the tournament

function buildRemainingPlayersList() {

  playerList = JSON.parse(localStorage.getItem('playerList'));
  
  let remainingPlayers = [];

  playerList.forEach(player => {
    
    if( player.active ) {
      remainingPlayers.push(player);
    }
  });

  localStorage.setItem('remainingPlayers', JSON.stringify(remainingPlayers));

}

// initialize existing player list

function buildPlayerListUI() {
  
  playerList.forEach(player => {
    if( player.active ) {
      player = buildPlayerEl(player.pid);
      HELPERS.getPlayerActionRow().before(player);
    }
  });
}

buildPlayerListUI();

// build payout results

function buildPayoutResults() {
  
  let i = 0;

  let playerList = JSON.parse(localStorage.getItem('playerList'));

  if ( playerList.length > 1 ) {

    while ( i < playerList.length ) {
      let emptyResult = document.createElement('div');
      emptyResult.setAttribute('data-empty', true);
      emptyResult.classList.add('player');
      emptyResult.innerHTML = `<span class="field"></span>`;
  
      if (i < payouts.length + 1 ) {
        HELPERS.getPayoutsCont().append( emptyResult );
      }
  
      i++;
    }
  }

  let payoutSlots = HELPERS.getPayoutsCont().querySelectorAll('.player');

  playerList.forEach(player => {
    if ( player.placed < payouts.length + 2 && player.placed ) {
      payoutSlots[player.placed - 1].querySelector('.field').innerText = player.name.toString();
    }
  });
}

// add payout badges to results

function addPayoutBadges() {
  let emptyResults = HELPERS.getPayoutsCont().querySelectorAll('.player');
  let i = 0;
  
  while (i < payouts.length + 1) {
    let tag = document.createElement('span');
    tag.classList.add('prize');

    if ( i < payouts.length ) {
      tag.innerHTML =
      `<sup>$</sup>${ payouts[i] }`;
    } else {
      tag.innerHTML =
      '<i class="fa-solid fa-face-dizzy"></i>'
    }

    emptyResults[i].querySelector('.field').append(tag);
    i++;
  }
}

// reset tournament

function resetTournament() {
  pauseTimer();
  timeRemaining = 0;
  localStorage.clear();
  location.reload();
}

// get date for export file name

function getCurrentDateFormatted() {
  const today = new Date();

  // Get the month (returns 0-11, so add 1)
  let month = today.getMonth() + 1;
  month = month < 10 ? '0' + month : month; // Add leading zero if necessary

  // Get the day
  let day = today.getDate();
  day = day < 10 ? '0' + day : day; // Add leading zero if necessary

  // Get the last two digits of the year
  let year = today.getFullYear().toString().slice(-2);

  return `${month}-${day}-${year}`;
}

// converst data to csv
function generateHTML(tournamentResults, payouts) {

  // sort results by placement
  tournamentResults = tournamentResults.sort((a, b) => a.placed - b.placed);

  let htmlContent = `<figure class="wp-block-table is-style-stripes">
  <table>
    <thead>
      <tr>
        <th class="has-text-align-center" data-align="center">Place</th>
        <th class="has-text-align-center" data-align="center">Player</th>
        <th class="has-text-align-center" data-align="center">Rebuys</th>
        <th class="has-text-align-center" data-align="center">Winnings</th>
      </tr>
    </thead>
    <tbody>`;
  // Loop through both arrays and add rows to the table
  for (let i = 0; i < tournamentResults.length; i++) {
    const name = tournamentResults[i]?.name || "";
    const placed = tournamentResults[i]?.placed || "";
    const payout = payouts[i] ? `$${payouts[i]}` : "-";

    // Add a row to the HTML table
    htmlContent += `
    <tr>
        <td class="has-text-align-center" data-align="center">${placed}</td>
        <td class="has-text-align-center" data-align="center">${name}</td>
        <td class="has-text-align-center" data-align="center"></td>
        <td class="has-text-align-center" data-align="center">${payout}</td>
    </tr>`;

    
}

  htmlContent += `
    </tbody>
    </table>
    </figure>`;

  return htmlContent;
}


// export tournament results (playerList)

function exportCSV() {

  let tournamentResults = JSON.parse(localStorage.getItem('playerList'));
  payouts = JSON.parse(localStorage.getItem('payouts'))
  
  // converts the array of objects to CSV format
  const html = generateHTML(tournamentResults, payouts);

  // creates a blob from the csv data
  const blob = new Blob([html], {type: 'text/html'});

  // creates a download link and sets the url to the blog object
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  date = getCurrentDateFormatted();

  a.download = `tournament-results-${date}.html`;

  // triggers the download
  a.click();

  // cleans up the URL
  URL.revokeObjectURL(url);
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

function initTimer( timeRemaining ) {
  // setup timer to begin running the first level
  HELPERS.getLevelCont().textContent = defaultBlindsData[currentLevel].label;
  // HELPERS.getMinutesCont().textContent = defaultBlindsData[currentLevel].time;
  // HELPERS.getSecondsCont().textContent = '00';

  setTimer( timeRemaining );

  HELPERS.getSmallBlindCont().textContent = defaultBlindsData[currentLevel].sb ? defaultBlindsData[currentLevel].sb : '-';
  HELPERS.getBigBlindCont().textContent = defaultBlindsData[currentLevel].bb ? defaultBlindsData[currentLevel].bb : '-';
  HELPERS.getAnteCont().textContent = defaultBlindsData[currentLevel].ante ? defaultBlindsData[currentLevel].ante : '-';

  if( currentLevel < (defaultBlindsData.length - 1)) {
    HELPERS.getNextSmallBlindCont().textContent = defaultBlindsData[currentLevel + 1].sb ? defaultBlindsData[currentLevel + 1].sb : '-';
    HELPERS.getNextBigBlindCont().textContent = defaultBlindsData[currentLevel + 1].bb ? defaultBlindsData[currentLevel + 1].bb : '-';
    HELPERS.getNextAnteCont().textContent = defaultBlindsData[currentLevel + 1].ante ? defaultBlindsData[currentLevel + 1].ante : '-';
  } 
  
  if( currentLevel == (defaultBlindsData.length - 1)) {
    HELPERS.getNextSmallBlindCont().textContent = '-';
    HELPERS.getNextBigBlindCont().textContent = '-';
    HELPERS.getNextAnteCont().textContent = '-';
  }

  if( currentLevel > 0 ) {
    HELPERS.getPrevSmallBlindCont().textContent = defaultBlindsData[currentLevel - 1].sb ? defaultBlindsData[currentLevel - 1].sb : '-';
    HELPERS.getPrevBigBlindCont().textContent = defaultBlindsData[currentLevel - 1].bb ? defaultBlindsData[currentLevel - 1].bb : '-';
    HELPERS.getPrevAnteCont().textContent = defaultBlindsData[currentLevel - 1].ante ? defaultBlindsData[currentLevel - 1].ante : '-';
  } else {
    HELPERS.getPrevSmallBlindCont().textContent = '-';
    HELPERS.getPrevBigBlindCont().textContent = '-';
    HELPERS.getPrevAnteCont().textContent = '-';
  }
}

initTimer( JSON.parse(localStorage.getItem('timeRemaining')) );

// initialize break timer

let timeToBreak;
let onBreak;

function setBreakTimer() {

  timeToBreak = 0;

  // if the current level is a break, set onBreak to true
  onBreak = ( defaultBlindsData[currentLevel].type == 'break' ) ? true : false;
  
  // loop through the blinds
  for (let level = currentLevel; level < defaultBlindsData.length; level++) {
    
      let blindLevel = defaultBlindsData[level];

      // stop when a break level is reached
      if ( blindLevel.type == 'break' ) {
        break;
      } else {
        // add up the minutes in each round that's not a blind
        timeToBreak += blindLevel.time * 60;
      }
  }

  // 
  // timeToBreak = ( onBreak ) ? (timeToBreak + defaultBlindsData[currentLevel].time * 60) : timeToBreak;

  localStorage.setItem('timeToBreak', JSON.stringify(timeToBreak));

  HELPERS.getBreakTimerCont().textContent = (onBreak) ? 0 + ' minutes' : parseInt(timeToBreak / 60) + ' minutes';

  return timeToBreak;
}

setBreakTimer();

// start timer

let timerInterval;
let isRunning = false;
let timeRemaining; // value in seconds expressed as integer

function setTimer(timeRemaining) {
  var minutes, seconds;
  minutes = parseInt(timeRemaining / 60, 10);
  seconds = parseInt(timeRemaining % 60, 10);
  // seconds = seconds < 10 ? "0" + seconds : seconds;

  HELPERS.getMinutesCont1().textContent = parseInt(minutes / 10, 10);
  HELPERS.getMinutesCont2().textContent = parseInt(minutes % 10, 10);
  HELPERS.getSecondsCont1().textContent = parseInt(seconds / 10, 10);
  HELPERS.getSecondsCont2().textContent = parseInt(seconds % 10, 10);
}

function startTimer(timeRemaining, timeToBreak) {

  isRunning = true;

  var minutes, seconds;
  timerInterval = setInterval(function () {
    console.log(currentLevel, onBreak, timeToBreak);

    --timeRemaining;
    timeToBreak = ( !onBreak ) ? --timeToBreak : 0;
    // --timeToBreak;

    localStorage.setItem('timeRemaining', timeRemaining);
    localStorage.setItem('timeToBreak', timeToBreak);

    minutes = parseInt(timeRemaining / 60, 10)
    seconds = parseInt(timeRemaining % 60, 10);

    // minutes = minutes < 10 ? "0" + minutes : minutes;
    // seconds = seconds < 10 ? "0" + seconds : seconds;

    HELPERS.getMinutesCont1().textContent = parseInt(minutes / 10, 10);
    HELPERS.getMinutesCont2().textContent = parseInt(minutes % 10, 10);
    HELPERS.getSecondsCont1().textContent = parseInt(seconds / 10, 10);
    HELPERS.getSecondsCont2().textContent = parseInt(seconds % 10, 10);

    HELPERS.getBreakTimerCont().textContent = parseInt(timeToBreak / 60) + ' minutes';

    
    if (timeRemaining == 59) {
      HELPERS.getAudioWarning().play();
    }
    
    if (timeRemaining == 3) {
      HELPERS.getAudioEndRound().play();
    }

    
    if (timeRemaining == 0) {
      clearInterval(timerInterval); // stops timer from progressing
      updateLevel(++currentLevel);
      getLevel();
      timeRemaining = defaultBlindsData[currentLevel].time * 60;
      initTimer( timeRemaining );
      setBreakTimer();
      // setBreakTimer put the value in localStorage, go get it
      timeToBreak = JSON.parse( localStorage.getItem('timeToBreak'));
      startTimer(timeRemaining, timeToBreak);
    } 
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

// get time remaining from timer display

function getTimeToBreak() {
  // timeRemaining = parseInt( HELPERS.getMinutesCont().textContent) * 60 + parseInt( HELPERS.getSecondsCont().textContent);
  timeToBreak = parseInt( localStorage.getItem('timeToBreak') );
  return timeToBreak;
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

  
  if ( playerList[pid].placed ) { 
    playerEl.setAttribute('data-placed', playerList[pid].placed );
  }

  playerEl.innerHTML = 
  `<form action="">
    <div class="delete">
      <button data-delete="${ pid }" class="tooltip"><i class="fa-solid fa-trash"></i></button>
    </div>
    <div>
      <label for="player-${ pid }"></label>
      <input type="text" id="player-${ pid }" data-pid="${ pid }" name="" value="${ name }">
    </div>
    <div class="rebuy">
      <button data-rebuy="${ pid }" class="tooltip"><i class="fa-solid fa-dollar"></i></button>
    </div>
    <div class="eliminate">
      <button data-eliminate="${ pid }" class="tooltip"><i class="fa-solid fa-user-slash"></i></button>
    </div>
  </form>`;


  playerEl.querySelector('input').addEventListener('focusout', updatePlayer );
  playerEl.querySelector('input').addEventListener('keypress', function(e) {
    
    if ( e.key === 'Enter' ) {
      e.preventDefault();
    }
  });
  playerEl.querySelector('.eliminate').addEventListener('click', eliminatePlayer);

  playerEl.querySelector('.rebuy').addEventListener('click', function(e){
    e.preventDefault();
    // console.log(e.target);
    let pid = e.target.dataset.rebuy;
    // console.log(pid);
    rebuyPlayer(pid);
  });
  playerEl.querySelector('.delete').addEventListener('click', function(e){

    e.preventDefault();
    
    let pid = e.target.parentElement.parentElement.parentElement.parentElement.dataset.player;
    
    if (window.confirm("Are you sure you want to delete this player?")) {
      deletePlayer( pid );
    } else {}
  });

  return playerEl;
}

// build player element to display in remaning/results containers

function buildPlayerResultEl( pid ) {
  pid = parseInt(pid, 10);
  playerList = JSON.parse(localStorage.getItem('playerList'));
  let playerEl = document.createElement('div');
  playerEl.classList.add('player');
  playerEl.setAttribute('data-player', pid);

  let player = playerList.find(player => player.pid === pid);

  if ( player.placed ) { 
    playerEl.setAttribute('data-placed', player.placed );
  }

  playerEl.innerHTML = 
  `<span class="field">
    <span class="name">${ player.name }</span>
  </span>
  <div class="re-enroll">
    <button class="tooltip">
      <i class="fa-solid fa-undo"></i>
    </button>
  </div>`

  return playerEl;
}



// create next eliminated player position

if( !localStorage.getItem('nextEliminatedPosition') ) {
  localStorage.setItem('nextEliminatedPosition', JSON.stringify(playerList.length));
}


// create prize pool

let prizePool = entryCount * 10;

let payouts = []; // array of payouts
let placesPaid = 1;

function updatePrizePool() {

  entryCount = localStorage.getItem('entryCount');
  prizePool = entryCount * 10;

  let payoutIndex;

  if ( entryCount <= 4 ) {
    payoutIndex = 0;
  } else {
    payoutIndex = entryCount - 4;
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

  localStorage.setItem('payouts', JSON.stringify(payouts));

  return payouts;
}


// update average stack

let averageStack;

function updateAverageStack() {
  if ( entryCount > 0 && remainingPlayerCount > 0 ) {
    averageStack = Math.round(entryCount * 10000 / remainingPlayerCount);
  } else if ( entryCount > 0 && remainingPlayerCount == 0 ) {
    averageStack = entryCount * 10000;
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
  pid = parseInt(pid, 10);

  let cleanName = DOMPurify.sanitize(this.value);

  playerList = JSON.parse(localStorage.getItem('playerList'));
  player = playerList.find(player => player.pid === pid);
  player.name = cleanName;
  this.value = cleanName;
  
  localStorage.setItem('playerList', JSON.stringify(playerList));

  // add player to remainingPlayers array

  let remainingPlayers = JSON.parse(localStorage.getItem('remainingPlayers'));
  let playerInRemaining = remainingPlayers.find(player => player.pid === pid);

  // check to see if player exists in the remainingPlayers array before adding a new entry

  if ( playerInRemaining ) {
    playerInRemaining.name = cleanName;
  } else {
    remainingPlayers.push(playerList[pid]);
  }
  localStorage.setItem('remainingPlayers', JSON.stringify(remainingPlayers));

  updatePlayerResultsLists();
}

// add player to player list in localStorage

function addPlayer( ) {
  playerList = JSON.parse(localStorage.getItem('playerList'));
  playerList.push({
    pid: playerList.length,
    active: true,
    name: "",
    rebuys: 0,
    placed: null
  });

  playerList.forEach(player => {
    if ( player.placed != null ) {
      ++player.placed;
    }
  });

  localStorage.setItem('playerList', JSON.stringify(playerList));
  
  entryCount++;
  remainingPlayerCount++;
  nextEliminatedPosition = JSON.parse(localStorage.getItem('nextEliminatedPosition'));
  nextEliminatedPosition++;
  localStorage.setItem('nextEliminatedPosition', JSON.stringify(nextEliminatedPosition));
  updateEntryCount();
  updateRemainingCount();
  updateAverageStack();
}

function rebuyPlayer( pid ) {
  // update player's rebuy record
  console.log(pid);
  playerList = JSON.parse(localStorage.getItem('playerList'));
  player = playerList.find(player => player.pid == pid);
  console.log(player);
  player.rebuys++;
  console.log(playerList);
  localStorage.setItem('playerList', JSON.stringify(playerList));

  

  entryCount++;
  updateEntryCount();
  updatePlayerResultsLists();
  updateAverageStack();
}

// delete player 

function deletePlayer( pid ) {
  pid = parseInt(pid, 10);
  remove = HELPERS.getPlayersMenu().querySelector(`[data-player='${ pid }']`);
  remove.remove();

  // remove player from playerList array
  playerList = JSON.parse(localStorage.getItem('playerList'));
  playerList = playerList.filter( player => player.pid !== pid);
  localStorage.setItem('playerList', JSON.stringify(playerList));

  // remove player from remainingPlayers array
  remainingPlayers = JSON.parse(localStorage.getItem('remainingPlayers'));
  remainingPlayers = remainingPlayers.filter( player => player.pid !== pid);
  localStorage.setItem('remainingPlayers', JSON.stringify(remainingPlayers));

  entryCount--;
  remainingPlayerCount--;
  nextEliminatedPosition = JSON.parse(localStorage.getItem('nextEliminatedPosition'));
  nextEliminatedPosition--;
  localStorage.setItem('nextEliminatedPosition', JSON.stringify(nextEliminatedPosition));
  updateEntryCount();
  updateRemainingCount();
  reorderPlacements();
  updatePlayerResultsLists();
}

// reorder placements

function reorderPlacements() {
  playerList = JSON.parse(localStorage.getItem('playerList'));

  playerList.forEach(player => {
    if ( !player.active ) { --player.placed; }
  });

  localStorage.setItem('playerList', JSON.stringify( playerList ));
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
  pid = this.parentElement.parentElement.dataset.player;
  pid = parseInt(pid, 10);

  this.parentElement.parentElement.remove();

  let nextEliminatedPosition = JSON.parse(localStorage.getItem('nextEliminatedPosition'));
  
  playerList = JSON.parse(localStorage.getItem('playerList'));

  let eliminatedPlayer = playerList.find(player => player.pid === pid);
  
  // Ensure eliminatedPlayer is a reference to the object in playerList
  if (eliminatedPlayer) {
    eliminatedPlayer.placed = nextEliminatedPosition;
    eliminatedPlayer.active = false;

    // Save the updated playerList back to localStorage
    localStorage.setItem('playerList', JSON.stringify(playerList));

    // Remove player from remainingPlayers array
    let remainingPlayers = JSON.parse(localStorage.getItem('remainingPlayers'));
    remainingPlayers = remainingPlayers.filter(player => player.pid !== eliminatedPlayer.pid);
    localStorage.setItem('remainingPlayers', JSON.stringify(remainingPlayers));

    --nextEliminatedPosition;
    localStorage.setItem('nextEliminatedPosition', JSON.stringify(nextEliminatedPosition));

    updatePlayerResultsLists();
    remainingPlayerCount--;
    updateRemainingCount();
    updateAverageStack();
  }
}

// re-enroll player

function reEnrollPlayer() {
  pid = this.parentElement.dataset.player;
  playerList = JSON.parse(localStorage.getItem('playerList'));
  nextEliminatedPosition = JSON.parse(localStorage.getItem('nextEliminatedPosition'));

  playerList.forEach(player => {
    if ( player.placed != null && player.placed < playerList[pid].placed ) {
      ++player.placed;
    }
  });
  
  playerList[pid].active = true;
  playerList[pid].placed = null;
  localStorage.setItem('playerList', JSON.stringify(playerList));

  let remainingPlayers = JSON.parse(localStorage.getItem('remainingPlayers'));
  remainingPlayers.push(playerList[pid]);
  localStorage.setItem('remainingPlayers', JSON.stringify(remainingPlayers));

  let playerEl = buildPlayerEl(pid);
  HELPERS.getPlayerActionRow().before( playerEl );

  updatePlayerResultsLists();

  remainingPlayerCount++;
  nextEliminatedPosition++;
  localStorage.setItem('nextEliminatedPosition', JSON.stringify(nextEliminatedPosition));
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
  HELPERS.getPayoutsCont().innerHTML = null;
  HELPERS.getPlayerResultsCont().innerHTML = null;
  // HELPERS.getPlayersRemainingCont().innerHTML = null;
  
  updatePrizePool();
  buildPayoutResults();
  
  let resultsList = [];

  playerList = JSON.parse(localStorage.getItem('playerList'));
  playerList.sort((a, b) => a.placed - b.placed);

  playerList.forEach(player => {
    if ( player.active === false ) {
      let playerEl = buildPlayerResultEl(player.pid);
      playerEl.querySelector('.re-enroll').addEventListener('click', reEnrollPlayer);
      resultsList.push(playerEl);
    }
  });

  // let sortedList = resultsList.sort((a, b) => a.value - b.value)
  // console.log(resultsList);

  resultsList.forEach(player => {
    HELPERS.getPlayerResultsCont().append(player);
  });


  if ( playerList.length > 1 ) { addPayoutBadges(); }
}

updatePlayerResultsLists();

const deletePlayerBtns = HELPERS.getPlayersMenu().querySelectorAll('.delete button');

deletePlayerBtns.forEach(button => {
  button.addEventListener('click', function(e){

    e.preventDefault();
    
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

function assignSeats() {

  playerCount = JSON.parse( localStorage.getItem( 'remainingPlayerCount' ) );

  tableCount = Math.ceil( playerCount / 9 );
  localStorage.setItem( 'tableCount', JSON.stringify(tableCount) );

  playerList = JSON.parse( localStorage.getItem( 'remainingPlayers' ) );

  shuffledList = shufflePlayers();

  for (let i = 0, s = 0; i < shuffledList.length; i++) {
    shuffledList[i].table = ( i % tableCount ) + 1;

    if ( i % tableCount == 0 ) { s++; }

    shuffledList[i].seat = s;
    
  }

  localStorage.setItem( 'remainingPlayers', JSON.stringify( shuffledList ));

  displaySeatingChart( tableCount, shuffledList );

}

function shufflePlayers () {

  remainingPlayers = JSON.parse(localStorage.getItem('remainingPlayers'));

  remainingPlayers.sort(() => Math.random() - 0.5);

  return remainingPlayers;

}

function displaySeatingChart( tableCount, shuffledList ) {

  if ( document.querySelector('.table-wrapper')) {
    document.querySelector('.table-wrapper').remove();
  }

  let tableWrapper = document.createElement('div');
  tableWrapper.classList.add('table-wrapper');

  for (let i = 0; i < tableCount; i++) {
    let tableContainer = document.createElement('div');
    tableContainer.classList.add('table');

    let tableName = document.createElement('h2');
    tableName.innerText = 'Table ' + (i + 1);

    tableContainer.append( tableName );

    let tableList = document.createElement('ol');

    tablePlayers = shuffledList.filter(player => player.table === (i + 1));

    for (let p = 0; p < tablePlayers.length; p++) {
      let player = document.createElement('li');
      player.innerText = tablePlayers[p].name;

      tableList.append(player);
    }

    tableContainer.append( tableList );
    tableWrapper.append( tableContainer );
    
  }

  HELPERS.getSeatingPanel().append( tableWrapper );

}