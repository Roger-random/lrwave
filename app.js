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

var stopbtnClick = function() {
  oscLeft.stop();
}

var updatelClick = function() {
  var newfreq = document.querySelector("#freql").value;
  oscLeft.frequency.setValueAtTime(newfreq, audioctx.currentTime);
}

var updaterClick = function() {
  var newfreq = document.querySelector("#freqr").value;
  oscRight.frequency.setValueAtTime(newfreq, audioctx.currentTime);
}

var handlerSetup = function() {
  document.querySelector("#gobtn").onclick = gobtnClick;
  document.querySelector("#stopbtn").onclick = stopbtnClick;
  document.querySelector("#updatel").onclick = updatelClick;
  document.querySelector("#updater").onclick = updaterClick;
};

if ( document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)) {
      handlerSetup();
} else {
  document.addEventListener("DOMContentLoaded", handlerSetup)
}