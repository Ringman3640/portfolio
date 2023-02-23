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
    ac.addTimelineEvent({time: 1, type: "Passed 1 second", targ: null});
    ac.addTimelineEvent({time: 2, type: "Passed 2 seconds", targ: null});
    ac.addTimelineEvent({time: 4.5, type: "Passed 4.5 seconds", targ: null});
    ac.addTimelineEvent({time: 21.21, type: "Passed 21.21 seconds", targ: null});

    ac.addTimelineEvent({time: 0, type: "Before 1 min", targ: null, continuous: true});
    ac.addTimelineEvent({time: 60, type: "After 1 min", targ: null, continuous: true});

    ac.loadAudio();
    ac.startup();
}

function timelineEventProcessor(event) {
    console.log(event.type);
}