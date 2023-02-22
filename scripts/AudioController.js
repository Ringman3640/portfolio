"use strict"

// AudioControllerClass
// Wrapper for the JS Audio() class that allows manipulation and observation of 
//      audio files.
class AudioController {
    // Constructor
    // 
    // audioURL (String) - URL to the target audio
    constructor(audioURL = null) {
        // Public data
        this.audioURL = audioURL;
        this.timeSlider = null;
        this.playButton = null;
        this.exitButton = null;
        this.timelineEventHandler = null;

        // Private data
        this._audioFile = null;
        this._audioPlaying = false;
        this._changingTime = false;
        this._startupCalled = false;
        this._eventTimeline = [];
        this._currTimelineIdx = null;
    }

    // Load the target sound file given audioURL
    // audioURL must be initialized
    loadAudio() {
        if (this.audioURL === null) {
            console.log("AudioController Error: No audio URL to load.");
            return false;
        }
        if (this._audioFile !== null) {
            return false;
        }

        this._audioFile = new Audio(this.audioURL);
        return true;
    }

    // Startup the AudioController handlers
    // loadAudio() must have completed and all required HTML elements must be referenced
    // 
    // autoStart (bool) - Indicate if the audio should start playing
    startup(autoStart = true) {
        if (this._audioFile == null) {
            console.log("AudioController Error: Tried start() without loading in audio.");
            return false;
        }
        if (this._startupCalled) {
            return false;
        }
        /*
        if (!this.audioURL || !this.timeSlider || !this.playButton || !this.exitButton) {
            console.log("AudioController Error: Tried start() without asigning all HTML elements.");
            return false;
        }
        */

        // Register event handlers
        this.timeSlider.addEventListener("mousedown", this._timeChangeStartHandler.bind(this));
        this.timeSlider.addEventListener("mouseup", this._timeChangeEndHandler.bind(this));
        this._audioFile.addEventListener("timeupdate", this._audioTimeUpdateHandler.bind(this));
        this.playButton.addEventListener("click", this._playPauseButtonHandler.bind(this));

        if (this._eventTimeline.length > 0) {
            this._currTimelineIdx = 0;
        }
        if (autoStart) {
            this._audioFile.play();
            this._audioPlaying = true;
        }
        
        this.timeSlider.val = 0;
        this._startupCalled = true;
        return true
    }

    // Add an event to the timeline.
    // This event is used to trigger the timelineEventHandler function during a specific time
    //      during audio playback, and the event object is passed to the handler function.
    // Events must be added before startup() is called.
    // The timelineEventHandler must be referenced before adding events to the timeline.
    // 
    // event (object) - Json object that contains the time and description of the event.
    // Format:
    //  time: --
    //  arg: --
    addTimelineEvent(event) {
        if (this._startupCalled) {
            console.log("AudioController Error: Cannot add timeline events after startup().");
            return false;
        }
        if (this.timelineEventhandler === null) {
            console.log("AudioController Error: Must define timelineEventHandler before adding events.");
            return false;
        }
        if (!("time" in event && "arg" in event)) {
            console.log("AudioController Error: Timeline event incorrect format.");
            return false;
        }

        this._eventTimeline.push(event);
        return true;
    }

    // Set the handler function that will be called when a timeline event is triggered.
    // The handler function must accept an argument, which is the value of the "arg" key
    //      of the triggered event.
    setTimelineEventHadler(handler) {
        this.timelineEventHandler = handler;
    }

    // Change _currTimelineIdx to match the current audio time.
    // Call this method after the audio currTime is changed by the user.
    _seekcurrTimelineIdx() {
        let timelineLen = this._eventTimeline.length;
        if (timelineLen == 0) {
            return;
        }

        this._currTimelineIdx = null;
        let currTime = this._audioFile.currentTime;
        for (let i = 0; i < timelineLen; ++i) {
            if (this._eventTimeline[i]["time"] >= currTime) {
                this._currTimelineIdx = i;
                break;
            }
        }
    }

    _timeChangeStartHandler() {
        this._changingTime = true;
        this._audioFile.pause();
    }

    _timeChangeEndHandler() {
        let nextTime = this.timeSlider.value / this.timeSlider.max * this._audioFile.duration;
        this._audioFile.currentTime = nextTime;
        this._seekcurrTimelineIdx();

        if (this._audioPlaying) {
            this._audioFile.play();
        }

        this._changingTime = false;
    }

    _audioTimeUpdateHandler() {
        // Update time slider value
        let nextVal = this._audioFile.currentTime / this._audioFile.duration * this.timeSlider.max;
        if (!this._changingTime) {
            this.timeSlider.value = nextVal;
        }

        // Check for timeline event trigger
        if (this._currTimelineIdx !== null) {
            if (this._audioFile.currentTime >= +this._eventTimeline[this._currTimelineIdx]["time"]) {
                this.timelineEventHandler(this._eventTimeline[this._currTimelineIdx]["arg"])

                ++this._currTimelineIdx;
                if (this._currTimelineIdx >= this._eventTimeline.length) {
                    this._currTimelineIdx = null;
                }
            }
        }
    }

    _playPauseButtonHandler() {
        if (this._audioPlaying) {
            this._audioFile.pause();
            this._audioPlaying = false;
        }
        else {
            this._audioFile.play();
            this._audioPlaying = true;
        }
    }
}

export {AudioController}