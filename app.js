//  Tell editor about Web Audio APIs so it does not flag "not defined" error.
/*
  global AudioContext
  global webkitAudioContext
*/

// Activate MDC JavaScript code on controls
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

// Duration to ramp to new audio parameter value.
const ramptime = 0.1;

// Create audio context object as appropriate for browser. Set it to suspended
// state so we don't start blasting out sound until user is ready.
var audioctx;
if (typeof AudioContext !== 'undefined') {
  // Chrome, Firefox, Edge
  audioctx = new AudioContext();
} else if (typeof webkitAudioContext !== 'undefined') {
  // Safari
  audioctx = new webkitAudioContext();
} else {
  document.querySelector("#controlbtn_icon").textContent = "error";
  document.querySelector("#errormsg").textContent = "Sorry, this browser does not support Web Audio API";
}
audioctx.suspend();

// Create audio context nodes.
// * Two oscillator nodes, one for each channel (left, right)
// * Two gain control nodes, one for each channel
// * One merger node to merge two separate channels into a stereo signal.
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

// When the control button is clicked, suspend or resume play as appropriate to
// toggle behavior.
var controlbtnClick = function(e) {
  if (audioctx.state==="suspended") {
    // Resuming from suspend, ramp frequency and gain to their new values.
    oscLeft.frequency.linearRampToValueAtTime(document.querySelector("#freql").value, audioctx.currentTime+ramptime);
    oscRight.frequency.linearRampToValueAtTime(document.querySelector("#freqr").value, audioctx.currentTime+ramptime);

    gainLeft.gain.linearRampToValueAtTime(document.querySelector("#gainl").value/100, audioctx.currentTime+ramptime);
    gainRight.gain.linearRampToValueAtTime(document.querySelector("#gainr").value/100, audioctx.currentTime+ramptime);

    audioctx.resume();

    // Update control button icon.
    document.querySelector("#controlbtn_icon").textContent = "pause";
  } else if (audioctx.state==="running") {
    // Suspending audio
    audioctx.suspend();
    document.querySelector("#controlbtn_icon").textContent = "play_arrow";
  } else {
    // Something is wrong
    document.querySelector("#errormsg").textContent = audioctx.state;
    document.querySelector("#controlbtn_icon").textContent = "error";
  }
};

// Connect all the JavaScript handlers to execute user interface actions
var handlerSetup = function() {
  document.querySelector("#controlbtn").onclick = controlbtnClick;
  document.querySelector("#freql").addEventListener("input", (e) => {
    oscLeft.frequency.linearRampToValueAtTime(e.target.value, audioctx.currentTime+ramptime);});
  document.querySelector("#freqr").addEventListener("input", (e) => {
    oscRight.frequency.linearRampToValueAtTime(e.target.value, audioctx.currentTime+ramptime);});
  document.querySelector("#freqlminus").onclick = () => {
    oscLeft.frequency.linearRampToValueAtTime(--document.querySelector("#freql").value, audioctx.currentTime+ramptime);};
  document.querySelector("#freqlplus").onclick = () => {
    oscLeft.frequency.linearRampToValueAtTime(++document.querySelector("#freql").value, audioctx.currentTime+ramptime);};
  document.querySelector("#freqrminus").onclick = () => {
    oscRight.frequency.linearRampToValueAtTime(--document.querySelector("#freqr").value, audioctx.currentTime+ramptime);};
  document.querySelector("#freqrplus").onclick = () => {
    oscRight.frequency.linearRampToValueAtTime(++document.querySelector("#freqr").value, audioctx.currentTime+ramptime);};
  document.querySelector("#waveforml").onchange = (e) => {
    oscLeft.type = e.target.value;};
  document.querySelector("#waveformr").onchange = (e) => {
    oscRight.type = e.target.value;};
  document.querySelector("#gainl").addEventListener("input", (e) => {
    gainLeft.gain.linearRampToValueAtTime(e.target.value/100, audioctx.currentTime+ramptime);});
  document.querySelector("#gainr").addEventListener("input", (e) => {
    gainRight.gain.linearRampToValueAtTime(e.target.value/100, audioctx.currentTime+ramptime);});
};

// Upon document ready, set up our JavaScript event handlers.
if ( document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)) {
      handlerSetup();
} else {
  document.addEventListener("DOMContentLoaded", handlerSetup);
}
