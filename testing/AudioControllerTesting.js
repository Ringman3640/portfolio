import {AudioController} from "../scripts/AudioController.js"

// Testing:
document.addEventListener("DOMContentLoaded", init);

let ac = new AudioController("../resources/audio/sus.mp3");

function init() {
    document.getElementById("load_button").addEventListener("click", startLoad);
}

function startLoad() {
    ac.timeSlider = document.getElementById("time_range");
    ac.playButton = document.getElementById("play_button");
    ac.setTimelineEventHadler(timelineEventProcessor);
    ac.addTimelineEvent({time: 1, arg: "Passed 1 second"});
    ac.addTimelineEvent({time: 2, arg: "Passed 2 seconds"});
    ac.addTimelineEvent({time: 4.5, arg: "Passed 4.5 seconds"});
    ac.addTimelineEvent({time: 21.21, arg: "Passed 21.21 seconds"});
    ac.loadAudio();
    ac.startup();
}

function timelineEventProcessor(arg) {
    console.log(arg);
}