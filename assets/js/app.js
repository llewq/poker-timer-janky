let averageStack;

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
let initialCount = 0;

if( !localStorage.getItem('entryCount') ) {
  entryCount = playerList.length;
  initialCount = playerList.length;
} else {
  entryCount = JSON.parse(localStorage.getItem('entryCount'));
  entryCount = parseInt(entryCount, 10);
  initialCount = JSON.parse(localStorage.getItem('initialCount'));
  initialCount = parseInt(initialCount, 10);
}

function updateEntryCount() {
  entryCount = parseInt(entryCount, 10);
  localStorage.setItem('entryCount', JSON.stringify(entryCount));
}
updateEntryCount();

function updateInitialCount() {
  initialCount = parseInt(initialCount, 10);
  HELPERS.getInitialCountCont().textContent = initialCount;
  localStorage.setItem('initialCount', JSON.stringify(initialCount));
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
  playerList = JSON.parse(localStorage.getItem('playerList'));
  playerList.forEach(player => {
    if( player.active ) {
      player = buildPlayerEl(player.pid);
      HELPERS.getPlayerActionRow().after(player);
    }
  });
}

buildPlayerListUI();

// renumbers the players in the player management panel
function updatePlayerCountInNav() {

  playerCount = JSON.parse(localStorage.getItem('initialCount'));
  counter = HELPERS.getPlayersMenu().querySelector('.player-count');
  counter.innerText = playerCount;
  
  remainingCount = JSON.parse(localStorage.getItem('remainingPlayerCount'));
  counterRemaining = HELPERS.getPlayersMenu().querySelector('.remaining-count');
  counterRemaining.innerText = remainingCount;

  
  // playerRowCounters = HELPERS.getPlayersMenu().querySelectorAll('.player-row .counter span');
  // let counter = 1;
  // playerRowCounters.forEach(row => {
  //   row.innerText = counter;
  //   counter++;
  // });
}

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
    const rebuys = tournamentResults[i]?.rebuys || "";
    const payout = payouts[i] ? `$${payouts[i]}` : "-";

    // Add a row to the HTML table
    htmlContent += `
    <tr>
        <td class="has-text-align-center" data-align="center">${placed}</td>
        <td class="has-text-align-center" data-align="center">${name}</td>
        <td class="has-text-align-center" data-align="center">${rebuys}</td>
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

function buildPlayerEl( pid ) {
  playerList = JSON.parse(localStorage.getItem('playerList'));
  let name;
  let player = playerList.find(player => player.pid === pid);
  if( player ) {
    pid = player.pid;
    name = player.name;
    rebuys = player.rebuys || 0;
  } else {
    addPlayer( pid ); // adds empty player
    pid = pid;
    name = "";
    rebuys = 0;

    // refreshes playerList if a new player was added
    playerList = JSON.parse(localStorage.getItem('playerList'));
    player = playerList.find(player => player.pid === pid);
  }

  let playerEl = document.createElement('div');
  playerEl.setAttribute('class', 'player-row');
  playerEl.setAttribute('data-player', pid );

  if ( player.placed ) { 
    playerEl.setAttribute('data-placed', player.placed );
  }


  playerEl.innerHTML = 
  `<form action="">
    <div class="delete">
      <button data-delete="${ pid }" class="tooltip"><i class="fa-solid fa-trash"></i></button>
    </div>
    <div class="counter">
      <span></span>
    </div>
    <div>
      <label for="player-${ pid }"></label>
      <input type="text" id="player-${ pid }" data-pid="${ pid }" name="" value="${ name }">
    </div>
    <div data-rebuy="${ pid }" class="rebuy tooltip">
      <button class="rebuy-minus ${rebuys > 0 ? '' : 'disabled'}">-</button>
      <span class="rebuy-count">${rebuys}</span>
      <button class="rebuy-plus">+</button>
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

  if ( playerEl.querySelector('.rebuy-plus') ) {
    playerEl.querySelector('.rebuy-plus').addEventListener('click', function(e){
      e.preventDefault();
      let pid = e.target.parentElement.dataset.rebuy;
      rebuyPlayer(pid, 1, playerEl);
    });
  }
  if ( playerEl.querySelector('.rebuy-minus') ) {
    playerEl.querySelector('.rebuy-minus').addEventListener('click', function(e){
      e.preventDefault();
      let pid = e.target.parentElement.dataset.rebuy;
      rebuyPlayer(pid, -1, playerEl);
    });
  }
  
  updatePlayerCountInNav();
  return playerEl;
}

const activePlayersContainer = document.querySelector('#active-players');

if (activePlayersContainer) {
    activePlayersContainer.addEventListener('click', function (e) {
        // Check if the clicked element is a delete button or its child
        if (e.target.matches('.delete button')) {
            e.preventDefault();
            // Find the button and extract the associated player ID
            const button = e.target.closest('button');
            const pid = parseInt(button?.dataset.delete, 10);

            if (pid) {
                deleteWarning(pid);
            }
        }
    });
}

function updateAddPlayerUI() {
  const actionRow = HELPERS.getPlayerActionRow(); // Get the action row container

  // Clear the existing content of the action row
  actionRow.innerHTML = '';

  // Create the form element
  const form = document.createElement('form');

  // Create the "Save" button container
  const saveDiv = document.createElement('div');
  saveDiv.classList.add('save'); // Add the 'save' class to the container
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.setAttribute('type', 'button');
  saveButton.classList.add('primary'); // Add the 'primary' class
  saveButton.addEventListener('click', function (e) {
      e.preventDefault();
      savePlayer(); // Call your save function
  });
  saveDiv.appendChild(saveButton); // Add the button to the div

  // Create the "Save and Add" button container
  const saveNewDiv = document.createElement('div');
  saveNewDiv.classList.add('save-new'); // Add the 'save-new' class to the container
  const saveAndAddButton = document.createElement('button');
  saveAndAddButton.textContent = 'Save and Add';
  saveAndAddButton.setAttribute('type', 'button');
  saveAndAddButton.classList.add('primary'); // Add the 'primary' class
  saveAndAddButton.addEventListener('click', function (e) {
      e.preventDefault();
      savePlayer(); // Call your save function
      updateAddPlayerUI(); // Reset the action row for adding another player
  });
  saveNewDiv.appendChild(saveAndAddButton); // Add the button to the div

  // Append the button containers to the form
  form.appendChild(saveDiv);
  form.appendChild(saveNewDiv);

  // Add the form to the action row
  actionRow.appendChild(form);
}



// checks status of rebuys when the delete player button is clicked
function deleteWarning(pid) {

  playerList = JSON.parse(localStorage.getItem('playerList'));
  player = playerList.find(player => player.pid === pid);

  if (player.rebuys > 0) {
    window.alert("Players who have purchased rebuys cannot be removed from the tournament.");
    return;
  }

  if (window.confirm("Are you sure you want to delete this player? This cannot be undone.")) {
    deletePlayer( pid );
  } else {}
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

  if ( player.rebuys > 0 ) {
    rebuys = player.rebuys;
  } else {
    rebuys = "";
  }

  playerEl.innerHTML = 
  `<span class="field">
    <span class="name">${ player.name }</span>
  </span>
  <div class="rebuy tooltip">
    <span class="rebuy-count">${rebuys}</span>
  </div>
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
  initialCount = localStorage.getItem('initialCount');
  prizePool = entryCount * 10;

  let payoutIndex;

  if ( initialCount <= 4 ) {
    payoutIndex = 0;
  } else {
    payoutIndex = initialCount - 4;
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
  let pid = parseInt(this.dataset.pid, 10);

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
    remainingPlayers.push(player);
  }
  localStorage.setItem('remainingPlayers', JSON.stringify(remainingPlayers));

  updatePlayerCountInNav();
  updatePlayerResultsLists();
}

// add player to player list in localStorage

function addPlayer( pid ) {
  playerList = JSON.parse(localStorage.getItem('playerList'));
  remainingList = JSON.parse(localStorage.getItem('remainingPlayers'));
  player = {
    pid: pid,
    active: true,
    name: "",
    rebuys: 0,
    placed: null
  };
  playerList.push(player);
  remainingList.push(player);

  playerList.forEach(player => {
    if ( player.placed != null ) {
      ++player.placed;
    }
  });

  localStorage.setItem('playerList', JSON.stringify(playerList));
  
  entryCount++;
  initialCount++;
  remainingPlayerCount++;
  nextEliminatedPosition = JSON.parse(localStorage.getItem('nextEliminatedPosition'));
  nextEliminatedPosition++;
  localStorage.setItem('nextEliminatedPosition', JSON.stringify(nextEliminatedPosition));
  updateEntryCount();
  updateInitialCount();
  updateRemainingCount();
  updateAverageStack();
  updatePlayerCountInNav();
}

function rebuyPlayer( pid, value, playerEl ) {

  if ( value > 0 ) {
    // update player's rebuy record
    playerList = JSON.parse(localStorage.getItem('playerList'));
    player = playerList.find(player => player.pid == pid);
    player.rebuys++;
    localStorage.setItem('playerList', JSON.stringify(playerList));

    remainingPlayers = JSON.parse(localStorage.getItem('remainingPlayers'));
    player = remainingPlayers.find(player => player.pid == pid);
    player.rebuys++;
    localStorage.setItem('remainingPlayers', JSON.stringify(remainingPlayers));
    
    entryCount++;
  } else {
    // update player's rebuy record
    playerList = JSON.parse(localStorage.getItem('playerList'));
    player = playerList.find(player => player.pid == pid);
    player.rebuys--;
    localStorage.setItem('playerList', JSON.stringify(playerList));

    remainingPlayers = JSON.parse(localStorage.getItem('remainingPlayers'));
    player = remainingPlayers.find(player => player.pid == pid);
    player.rebuys--;
    localStorage.setItem('remainingPlayers', JSON.stringify(remainingPlayers));

    entryCount--;
  }
  

  const rebuyButton = playerEl.querySelector('.rebuy');
  const newRebuyButton = document.createElement('div');
  newRebuyButton.classList.add('rebuy', 'tooltip');
  newRebuyButton.dataset.rebuy = pid;
  if (player.rebuys > 0) {
    newRebuyButton.innerHTML = `
        <button class="rebuy-minus">-</button>
        <span class="rebuy-count">${player.rebuys}</span>
        <button class="rebuy-plus">+</button>`;
  } else {
    newRebuyButton.innerHTML = `
        <button class="rebuy-minus disabled">-</button>
        <span class="rebuy-count">${player.rebuys}</span>
        <button class="rebuy-plus">+</button>`;
  }

  rebuyButton.replaceWith(newRebuyButton);

  if ( playerEl.querySelector('.rebuy-plus') ) {
    playerEl.querySelector('.rebuy-plus').addEventListener('click', function(e){
      e.preventDefault();
      let pid = e.target.parentElement.dataset.rebuy;
      rebuyPlayer(pid, 1, playerEl);
    });
  }
  if ( playerEl.querySelector('.rebuy-minus') ) {
    playerEl.querySelector('.rebuy-minus').addEventListener('click', function(e){
      e.preventDefault();
      let pid = e.target.parentElement.dataset.rebuy;
      rebuyPlayer(pid, -1, playerEl);
    });
  }

  updateEntryCount();
  updatePlayerResultsLists();
  updateAverageStack();
}

// delete player 

function deletePlayer(pid) {
    
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
  initialCount--;
  remainingPlayerCount--;
  nextEliminatedPosition = JSON.parse(localStorage.getItem('nextEliminatedPosition'));
  nextEliminatedPosition--;
  localStorage.setItem('nextEliminatedPosition', JSON.stringify(nextEliminatedPosition));
  updateEntryCount();
  updateInitialCount();
  updateRemainingCount();
  reorderPlacements();
  updatePlayerResultsLists();
  updatePlayerCountInNav();
}

// reorder placements

function reorderPlacements() {
  playerList = JSON.parse(localStorage.getItem('playerList'));

  playerList.forEach(player => {
    if ( !player.active ) { --player.placed; }
  });

  localStorage.setItem('playerList', JSON.stringify( playerList ));
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
    updatePlayerCountInNav();
  }
}

// re-enroll player

function reEnrollPlayer() {
  pid = parseInt(this.parentElement.dataset.player, 10);
  playerList = JSON.parse(localStorage.getItem('playerList'));
  console.log(playerList);
  let playerToReEnroll = playerList.find(player => player.pid === pid);
  console.log(playerToReEnroll);
  nextEliminatedPosition = JSON.parse(localStorage.getItem('nextEliminatedPosition'));

  playerList.forEach(player => {
    if ( player.placed != null && player.placed < playerToReEnroll.placed ) {
      ++player.placed;
    }
  });
  
  playerToReEnroll.active = true;
  playerToReEnroll.placed = null;
  localStorage.setItem('playerList', JSON.stringify(playerList));

  let remainingPlayers = JSON.parse(localStorage.getItem('remainingPlayers'));
  remainingPlayers.push(playerToReEnroll);
  localStorage.setItem('remainingPlayers', JSON.stringify(remainingPlayers));

  let playerEl = buildPlayerEl(pid);
  HELPERS.getPlayerActionRow().after( playerEl );

  updatePlayerResultsLists();

  remainingPlayerCount++;
  nextEliminatedPosition++;
  localStorage.setItem('nextEliminatedPosition', JSON.stringify(nextEliminatedPosition));
  updateRemainingCount();
  updateAverageStack();
  updatePlayerCountInNav();
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

  console.log('Before sorting:', playerList);

  playerList = JSON.parse(localStorage.getItem('playerList'));
  playerList.sort((a, b) => a.placed - b.placed);

  console.log('after sorting:', playerList);


  playerList.forEach(player => {
    if ( player.active === false ) {
      let playerEl = buildPlayerResultEl(player.pid);
      playerEl.querySelector('.re-enroll').addEventListener('click', reEnrollPlayer);
      resultsList.push(playerEl);
    }
  });


  resultsList.forEach(player => {
    HELPERS.getPlayerResultsCont().append(player);
  });


  if ( playerList.length > 1 ) { addPayoutBadges(); }
}

updatePlayerResultsLists();


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

updatePlayerCountInNav();