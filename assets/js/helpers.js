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

HELPERS.getPlayersPanel = function() {
  return document.querySelector('#players');
}

HELPERS.getInfoPanel = function() {
  return document.querySelector('#info');
}

HELPERS.getMainPanel = function() {
  return document.querySelector('#main');
}

//
// nav panels
//

HELPERS.getPlayersMenu = function() {
  return document.querySelector('#navPlayers');
}
const menuPanelPlayers = document.querySelector('#navPlayers');

//
// controls 
//

HELPERS.getToolsCont = function() {
  return document.querySelector('#tools');
}

HELPERS.getPlayBtn = function() {
  return HELPERS.getMainPanel().querySelector('.play');
}

HELPERS.getPrevBtn = function() {
  return HELPERS.getMainPanel().querySelector('.prev');
}

HELPERS.getNextBtn = function() {
  return HELPERS.getMainPanel().querySelector('.next');
}

HELPERS.getResetBtn = function() {
  return HELPERS.getToolsCont().querySelector('.reset-btn');
}

//
// timer 
//

HELPERS.getLevelCont = function() {
  return HELPERS.getMainPanel().querySelector('.level');
}

HELPERS.getMinutesCont = function() {
  return HELPERS.getMainPanel().querySelector('.minutes');
}

HELPERS.getSecondsCont = function() {
  return HELPERS.getMainPanel().querySelector('.seconds');
}

HELPERS.getBlindsCont = function() {
  return HELPERS.getMainPanel().querySelector('.blinds');
}

HELPERS.getSmallBlindCont = function() {
  return HELPERS.getBlindsCont().querySelector('.small-blind .value');
}

HELPERS.getBigBlindCont = function() {
  return HELPERS.getBlindsCont().querySelector('.big-blind .value');
}

HELPERS.getAnteCont = function() {
  return HELPERS.getBlindsCont().querySelector('.ante .value');
}

HELPERS.getNextBlindsCont = function() {
  return HELPERS.getInfoPanel().querySelector('#next');
}

HELPERS.getNextSmallBlindCont = function() {
  return HELPERS.getInfoPanel().querySelector('.small-blind .value');
}

HELPERS.getNextBigBlindCont = function() {
  return HELPERS.getInfoPanel().querySelector('.big-blind .value');
}

HELPERS.getNextAnteCont = function() {
  return HELPERS.getInfoPanel().querySelector('.ante .value');
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
  return HELPERS.getPlayersPanel().querySelectorAll('button');
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
  return HELPERS.getPlayersPanel().querySelector('#players-remaining #player-list-1');
}

HELPERS.getPlayerResultsCont = function() {
  return HELPERS.getPlayersPanel().querySelector('#results #player-list-2');
}
