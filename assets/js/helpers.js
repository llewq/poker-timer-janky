const HELPERS = {

  //
  // menu
  //

  getMenuBtn() {
    return document.querySelector('#tools .menu-btn');
  },

  getMenu() {
    return document.querySelector('#menu');
  },

  getCloseBtn() {
    return HELPERS.getMenu().querySelector('.close-btn');
  },

  getMenuPanels() {
    return document.querySelectorAll('#menu > div');
  },

  getBackBtns() {
    return HELPERS.getMenu().querySelectorAll('.back');
  }
};



//
// panels
//

HELPERS.getToolsPanel = function() {
  return document.querySelector('#tools');
}

HELPERS.getSeatingPanel = function() {
  return document.querySelector('#seating');
}

HELPERS.getPayoutsPanel = function() {
  return document.querySelector('#payouts');
}

HELPERS.getInfoPanel = function() {
  return document.querySelector('#info');
}

HELPERS.getTimerPanel = function() {
  return document.querySelector('#timer');
}

HELPERS.getPrevBlindsPanel = function() {
  return document.querySelector('#blinds-prev');
}

HELPERS.getCurrentBlindsPanel = function() {
  return document.querySelector('#blinds-current');
}

HELPERS.getNextBlindsPanel = function() {
  return document.querySelector('#blinds-next');
}

//
// nav panels
//

HELPERS.getPlayersMenu = function() {
  return document.querySelector('#navPlayers');
}
const menuPanelPlayers = document.querySelector('#navPlayers');

// 
// tools
//

HELPERS.getSeatingOpenBtn = function() {
  return HELPERS.getToolsPanel().querySelector('.seating-btn');
}

// 
// seating
//

HELPERS.getSeatingCloseBtn = function() {
  return HELPERS.getSeatingPanel().querySelector('.seating-close-btn');
}

HELPERS.getAssignSeatingBtn = function() {
  return HELPERS.getSeatingPanel().querySelector('.seating-seat-btn');
}

//
// controls 
//

HELPERS.getPlayBtn = function() {
  return HELPERS.getTimerPanel().querySelector('.play');
}

HELPERS.getPrevBtn = function() {
  return HELPERS.getTimerPanel().querySelector('.prev');
}

HELPERS.getNextBtn = function() {
  return HELPERS.getTimerPanel().querySelector('.next');
}

HELPERS.getResetBtn = function() {
  return HELPERS.getToolsPanel().querySelector('.reset-btn');
}

HELPERS.getExportBtn = function() {
  return HELPERS.getToolsPanel().querySelector('.export-btn');
}

//
// timer 
//

HELPERS.getLevelCont = function() {
  return HELPERS.getTimerPanel().querySelector('.level');
}

HELPERS.getMinutesCont1 = function() {
  return HELPERS.getTimerPanel().querySelector('.minutes-1');
}

HELPERS.getMinutesCont2 = function() {
  return HELPERS.getTimerPanel().querySelector('.minutes-2');
}

HELPERS.getSecondsCont1 = function() {
  return HELPERS.getTimerPanel().querySelector('.seconds-1');
}

HELPERS.getSecondsCont2 = function() {
  return HELPERS.getTimerPanel().querySelector('.seconds-2');
}

HELPERS.getBlindsCont = function() {
  return HELPERS.getCurrentBlindsPanel().querySelector('.blinds');
}

HELPERS.getSmallBlindCont = function() {
  return HELPERS.getCurrentBlindsPanel().querySelector('.small-blind .value');
}

HELPERS.getBigBlindCont = function() {
  return HELPERS.getCurrentBlindsPanel().querySelector('.big-blind .value');
}

HELPERS.getAnteCont = function() {
  return HELPERS.getCurrentBlindsPanel().querySelector('.ante .value');
}

HELPERS.getNextSmallBlindCont = function() {
  return HELPERS.getNextBlindsPanel().querySelector('.small-blind .value');
}

HELPERS.getNextBigBlindCont = function() {
  return HELPERS.getNextBlindsPanel().querySelector('.big-blind .value');
}

HELPERS.getNextAnteCont = function() {
  return HELPERS.getNextBlindsPanel().querySelector('.ante .value');
}

HELPERS.getPrevSmallBlindCont = function() {
  return HELPERS.getPrevBlindsPanel().querySelector('.small-blind .value');
}

HELPERS.getPrevBigBlindCont = function() {
  return HELPERS.getPrevBlindsPanel().querySelector('.big-blind .value');
}

HELPERS.getPrevAnteCont = function() {
  return HELPERS.getPrevBlindsPanel().querySelector('.ante .value');
}

//
// submenu nav items
//

HELPERS.getLevelsMenuLink = function() {
  return HELPERS.getMenu().querySelector('nav a.levels');
}

HELPERS.getPlayersMenuLink = function() {
  return HELPERS.getMenu().querySelector('nav a.players');
}

HELPERS.getCashMenuLink = function() {
  return HELPERS.getMenu().querySelector('nav a.cash');
}

HELPERS.getAudioMenuLink = function() {
  return HELPERS.getMenu().querySelector('nav a.audio');
}

//
// submenu panels
//

HELPERS.getLevelsSubmenu = function() {
  return HELPERS.getMenu().querySelector('#navLevels');
}

HELPERS.getPlayersSubmenu = function() {
  return HELPERS.getMenu().querySelector('#navPlayers');
}

HELPERS.getCashSubmenu = function() {
  return HELPERS.getMenu().querySelector('#navCash');
}

HELPERS.getAudioSubmenu = function() {
  return HELPERS.getMenu().querySelector('#navAudio');
}

//
// accordion buttons
//

HELPERS.getAccordionBtns = function() {
  return HELPERS.getPayoutsPanel().querySelectorAll('button');
}

//
// audio clips
//

HELPERS.getAudioCont = function() {
  return document.querySelector('#audio-clips');
}

HELPERS.getAudioEndRound = function() {
  return HELPERS.getAudioCont().querySelector('#audio-timer');
}

HELPERS.getAudioWarning = function() {
  return HELPERS.getAudioCont().querySelector('#audio-warning');
}

//
// info panel
//

HELPERS.getInitialCountCont = function() {
  return HELPERS.getInfoPanel().querySelector('#player-count-initial');
}

HELPERS.getRemainingCountCont = function() {
  return HELPERS.getInfoPanel().querySelector('#player-count-remaining');
}

HELPERS.getAveargeStackCont = function() {
  return HELPERS.getInfoPanel().querySelector('#average-stack');
}

HELPERS.getBreakTimerCont = function() {
  return HELPERS.getInfoPanel().querySelector('#break-timer p');
}
//
// players panel
//

HELPERS.getPlayerActionRow = function() {
  return menuPanelPlayers.querySelector('.action-row');
}

HELPERS.getAddPlayerBtn = function() {
  return HELPERS.getPlayerActionRow().querySelector('button');
}

//
// results/remaining panel
//

HELPERS.getPlayersRemainingCont = function() {
  return HELPERS.getPlayersMenu().querySelector('#active-players');
}

HELPERS.getPlayerResultsCont = function() {
  return HELPERS.getPlayersMenu().querySelector('#inactive-players .content');
}

HELPERS.getPayoutsCont = function() {
  return HELPERS.getPayoutsPanel().querySelector('#results .content');
}



// --- Levels editor helpers ---
HELPERS.getLevelsPanel = function() {
  return document.querySelector('#navLevels');
}

HELPERS.getLevelsContent = function() {
  return HELPERS.getLevelsPanel().querySelector('.content');
}

HELPERS.getLevelsHeader = function() {
  return HELPERS.getLevelsContent().querySelector('.header');
}

HELPERS.getLevelsOptionRow = function() {
  return HELPERS.getLevelsPanel().querySelector('.option-row');
}

HELPERS.getLevelsActionRow = function() {
  return HELPERS.getLevelsPanel().querySelector('.action-row');
}

HELPERS.getAddBlindBtn = function() {
  return HELPERS.getLevelsOptionRow().querySelector('.blind button');
}

HELPERS.getAddBreakBtn = function() {
  return HELPERS.getLevelsOptionRow().querySelector('.break button');
}

HELPERS.getLevelsResetBtn = function() {
  return HELPERS.getLevelsActionRow().querySelector('.reset button');
}

HELPERS.getLevelsAddBtn = function() {
  return HELPERS.getLevelsActionRow().querySelector('.add button');
}

HELPERS.getOptionBlindBtn = function() {
  return HELPERS.getLevelsOptionRow().querySelector('.blind button');
}
HELPERS.getOptionBreakBtn = function() {
  return HELPERS.getLevelsOptionRow().querySelector('.break button');
}
HELPERS.getOptionCancelBtn = function() {
  return HELPERS.getLevelsOptionRow().querySelector('.cancel button');
}

// Skip controls
HELPERS.getSkipBackBtn = function () {
  return HELPERS.getTimerPanel().querySelector('.skip-back');
}
HELPERS.getSkipForwardBtn = function () {
  return HELPERS.getTimerPanel().querySelector('.skip-forward');
}
