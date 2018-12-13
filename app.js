//  Tell editor about Web Audio APIs so it does not flag "not defined" error.
/*
  global AudioContext
  global OscillatorNode
  global ChannlMergerNode
*/

import {MDCRipple} from '@material/ripple/index';
for (const appbutton of document.querySelectorAll(".app-button")) {
  new MDCRipple(appbutton);
}

import {MDCTextField} from '@material/textfield';
for (const mdctextfield of document.querySelectorAll('.mdc-text-field')) {
  new MDCTextField(mdctextfield);
}

var audioctx = new AudioContext();
var oscLeft = audioctx.createOscillator();
var oscRight = audioctx.createOscillator();
var merger = audioctx.createChannelMerger(2);

var gobtnClick = function() {
  var freql = document.querySelector("#freql").value;
  oscLeft.frequency.setValueAtTime(freql, audioctx.currentTime);

  var freqr = document.querySelector("#freqr").value;
  oscRight.frequency.setValueAtTime(freqr, audioctx.currentTime);

  oscLeft.connect(merger, 0, 0);
  oscRight.connect(merger, 0, 1);

  merger.connect(audioctx.destination);

  oscLeft.start(0);
  oscRight.start(0);
}

var freqlnewinput = function() {
  var newfreq = document.querySelector("#freql").value;
  oscLeft.frequency.setValueAtTime(newfreq, audioctx.currentTime);
}

var freqrnewinput = function() {
  var newfreq = document.querySelector("#freqr").value;
  oscRight.frequency.setValueAtTime(newfreq, audioctx.currentTime);
}

var handlerSetup = function() {
  document.querySelector("#gobtn").onclick = gobtnClick;
  document.querySelector("#freql").addEventListener("input", freqlnewinput);
  document.querySelector("#freqr").addEventListener("input", freqrnewinput);
};

if ( document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)) {
      handlerSetup();
} else {
  document.addEventListener("DOMContentLoaded", handlerSetup)
}