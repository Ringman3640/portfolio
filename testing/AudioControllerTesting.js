import {AudioController} from "../scripts/AudioController.js"

// Testing:
document.addEventListener("DOMContentLoaded", init);

let ac = new AudioController("../resources/audio/sus.mp3");

function init() {
    document.getElementById("load_button").addEventListener("click", startLoad);
    document.getElementById("start_button").addEventListener("click", startupMedia);
    document.getElementById("stop_button").addEventListener("click", stopMedia);
}

function startLoad() {
    ac.timeSlider = document.getElementById("time_range");
    ac.playButton = document.getElementById("play_button");
    ac.setTimelineEventHadler(timelineEventProcessor);
    ac.loadEvents("AudioControllerTestingEvents.json");

    ac.loadAudio();
}

function startupMedia() {
    ac.startup();
}

function stopMedia() {
    ac.shutdown();
}

function timelineEventProcessor(event) {
    console.log(event.type);
}