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

import {MDCSelect} from '@material/select';
for (const mdcselect of document.querySelectorAll('.mdc-select')) {
  new MDCSelect(mdcselect);
}

const ramptime = 0.1; // Duration to ramp to new audio parameter value.

var audioctx = new AudioContext();
var oscLeft = audioctx.createOscillator();
var gainLeft = audioctx.createGain();
var oscRight = audioctx.createOscillator();
var gainRight = audioctx.createGain();
var merger = audioctx.createChannelMerger(2);

oscLeft.connect(gainLeft);
oscRight.connect(gainRight);

gainLeft.connect(merger, 0, 0);
gainRight.connect(merger, 0, 1);

merger.connect(audioctx.destination);

oscLeft.start(0);
oscRight.start(0);
audioctx.suspend();

var controlbtnClick = function(e) {
  if (audioctx.state==="suspended") {
    oscLeft.frequency.linearRampToValueAtTime(document.querySelector("#freql").value, audioctx.currentTime+ramptime);
    oscRight.frequency.linearRampToValueAtTime(document.querySelector("#freqr").value, audioctx.currentTime+ramptime);

    gainLeft.gain.linearRampToValueAtTime(document.querySelector("#gainl").value/100, audioctx.currentTime+ramptime);
    gainRight.gain.linearRampToValueAtTime(document.querySelector("#gainr").value/100, audioctx.currentTime+ramptime);

    audioctx.resume();
    document.querySelector("#controlbtn_icon").textContent = "pause";
  } else if (audioctx.state==="running") {
    audioctx.suspend();
    document.querySelector("#controlbtn_icon").textContent = "play_arrow";
  } else {
    document.querySelector("#controlbtn_icon").textContent = "error";
  }
}

var freqlnewinput = function(e) {
  oscLeft.frequency.linearRampToValueAtTime(e.target.value, audioctx.currentTime+ramptime);
}

var freqlminus = function() {
  oscLeft.frequency.linearRampToValueAtTime(--document.querySelector("#freql").value, audioctx.currentTime+ramptime);
}

var freqlplus = function() {
  oscLeft.frequency.linearRampToValueAtTime(++document.querySelector("#freql").value, audioctx.currentTime+ramptime);
}

var waveformlchange = function(e) {
  oscLeft.type = e.target.value;
}

var gainlnewinput = function(e) {
  gainLeft.gain.linearRampToValueAtTime(e.target.value/100, audioctx.currentTime+ramptime);
}

var freqrnewinput = function(e) {
  oscRight.frequency.linearRampToValueAtTime(e.target.value, audioctx.currentTime+ramptime);
}

var freqrminus = function() {
  oscRight.frequency.linearRampToValueAtTime(--document.querySelector("#freqr").value, audioctx.currentTime+ramptime);
}

var freqrplus = function() {
  oscRight.frequency.linearRampToValueAtTime(++document.querySelector("#freqr").value, audioctx.currentTime+ramptime);
}

var waveformrchange = function(e) {
  oscRight.type = e.target.value;
}

var gainrnewinput = function(e) {
  gainRight.gain.linearRampToValueAtTime(e.target.value/100, audioctx.currentTime+ramptime);
}

var handlerSetup = function() {
  document.querySelector("#controlbtn").onclick = controlbtnClick;
  document.querySelector("#freql").addEventListener("input", freqlnewinput);
  document.querySelector("#freqlminus").onclick = freqlminus;
  document.querySelector("#freqlplus").onclick = freqlplus;
  document.querySelector("#waveforml").onchange = waveformlchange;
  document.querySelector("#gainl").addEventListener("input", gainlnewinput);
  document.querySelector("#freqr").addEventListener("input", freqrnewinput);
  document.querySelector("#freqrminus").onclick = freqrminus;
  document.querySelector("#freqrplus").onclick = freqrplus;
  document.querySelector("#waveformr").onchange = waveformrchange;
  document.querySelector("#gainr").addEventListener("input", gainrnewinput);
};

if ( document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)) {
      handlerSetup();
} else {
  document.addEventListener("DOMContentLoaded", handlerSetup)
}