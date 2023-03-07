// AudioController.js
// Author: Franz Alarcon

"use strict"

// AudioController Class
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
        this.timelineEventHandler = null;

        // Public state data
        this.started = false;
        this.paused = true;

        // Private data
        this._audioFile = null;
        this._audioPlaying = false;
        this._changingTime = false;
        this._eventTimeline = [];
        this._continuousEvents = [];
        this._currTimelineIdx = null;

        this._audioLoading = false;
        this._startupWaitingForAudio = false;

        this._eventsFileLoading = false;
        this._startupWaitingForEvents = false;
    }

    // Load the target sound file given audioURL
    // audioURL must be initialized
    loadAudio() {
        if (this.audioURL === null) {
            console.error("AudioController: No audio URL to load.");
            return false;
        }
        if (this._audioFile !== null) {
            return false;
        }

        this._audioLoading = true;
        this._audioFile = new Audio(this.audioURL);
        this._audioFile.addEventListener(
                "canplaythrough", 
                this._audioLoadedHandler.bind(this));
        return true;
    }

    // Load in a list of events from a specified JSON file.
    // The JSON file must consist of a JSON object with an "events" property.
    //      This property contains an array of event JSON objects.
    // 
    // eventsURL (string) - URL path to the events JSON file.
    loadEvents(eventsURL) {
        if (this.started) {
            console.error("AudioController: Cannot add timeline events after"
                    + " startup().");
            return false;
        }

        this._eventsFileLoading = true;
        const req = new XMLHttpRequest();

        let self = this;
        req.onload = function() {
            if (this.status !== 200) {
                console.error("AudioController: Cannot load events file.");
                return;
            }

            self._eventsLoadedHandler(this);
        };

        req.open("get", eventsURL);
        req.send();
    }

    // Add an event to the timeline.
    // This event is used to trigger the timelineEventHandler function during a
    //      specific time during audio playback, and the event object is passed
    //      to the handler function.
    // Events must be added before startup() is called.
    // The timelineEventHandler must be referenced before adding events to the
    //      timeline.
    // Events on the timeline will be sorted based on their time values. The
    //      sorting occurs when startup() is called.
    // 
    // event (object) - Json object that contains the time and description of
    //      the event.
    // Event JSON Format:
    //      time (float):   Scheduled time when the event takes place
    //      type (string):  The type of the event
    //      targ (string):  The target of the event; usually an HTML element ID
    //      continuous (bool, optional): Specifies if the event is continuous*
    // 
    // * Normal events can be skipped if the user manually changes the time
    //      forward. Continuous events are executed if the user enters a range
    //      in the timeline (between continuous events). On a manual time
    //      change, the most previous continuous event will be called.
    // * If the continuous property is not found in the event, it will be
    //      assumed that the event is not continuous.
    addTimelineEvent(event) {
        if (this.started) {
            console.error("AudioController: Cannot add timeline events after"
                    + " startup().");
            return false;
        }
        if (!this.timelineEventHandler) {
            console.error("AudioController: Must define timelineEventHandler"
                    + " before adding events.");
            return false;
        }
        if (!("time" in event && "type" in event && "targ" in event)) {
            console.error("AudioController: Timeline event incorrect format.");
            return false;
        }

        this._eventTimeline.push(event);

        if ("continuous" in event && event["continuous"] === true) {
            this._continuousEvents.push(event);
        }

        return true;
    }

    // Set the handler function that will be called when a timeline event is 
    //      triggered.
    // The handler function must accept an argument, which is the value of the
    //      "arg" key of the triggered event.
    setTimelineEventHadler(handler) {
        this.timelineEventHandler = handler;
    }

    // Startup the AudioController handlers
    // loadAudio() must have completed and all required HTML elements must be
    //      referenced.
    // 
    // autoStart (bool) - Indicate if the audio should start playing
    startup(autoStart = true) {
        // Check for async loading
        if (this._audioLoading) {
            this._startupWaitingForAudio = true;
            return;
        }
        if (this._eventsFileLoading) {
            this._startupWaitingForEvents = true;
            return;
        }

        if (this._audioFile == null) {
            console.error("AudioController: Tried start() without loading in"
                    + " audio.");
            return false;
        }
        if (this.started) {
            return false;
        }
        if (!this.audioURL || !this.timeSlider || !this.playButton) {
            console.error("AudioController: Tried start() without asigning all"
                    + "HTML elements.");
            return false;
        }

        // Register event handlers
        this.timeSlider.addEventListener(
                "mousedown", 
                this._timeChangeStartHandler.bind(this)
        );
        this.timeSlider.addEventListener(
                "mouseup", 
                this._timeChangeEndHandler.bind(this)
        );
        this._audioFile.addEventListener(
                "timeupdate", 
                this._audioTimeUpdateHandler.bind(this)
        );
        this.playButton.addEventListener(
                "click", 
                this._playPauseButtonHandler.bind(this)
        );

        // Sort event timelines
        let sortFunc = (a, b) => {
            return a.time - b.time;
        }
        this._eventTimeline.sort(sortFunc);
        this._continuousEvents.sort(sortFunc);

        if (this._eventTimeline.length > 0) {
            this._currTimelineIdx = 0;
        }
        if (autoStart) {
            this._audioFile.play();
            this._audioPlaying = true;
            this.paused = false;
        }
        
        this.timeSlider.val = 0;
        this.started = true;
        return true
    }

    // Shutdown control of the handlers.
    // Reverts the AudioController state to before startup() has been called.
    shutdown() {
        if (!this.started) {
            return;
        }

        // Stop audio
        this._audioFile.pause();
        this._audioPlaying = false;
        this._audioFile.currentTime = 0;
        this.timeSlider.value = 0;

        // Deregister event handlers
        // I use addEventListener instead of removeEventListener here because
        //      removeEventListener was not disabling events from the referenced
        //      HTML elements for some reason. Howevever, calling
        //      addEventListener again seems to toggle them off??? Imma just
        //      stick with this since it seems to work. Javascript is pain and
        //      suffering :)
        this.timeSlider.addEventListener(
                "mousedown", 
                this._timeChangeStartHandler.bind(this)
        );
        this.timeSlider.addEventListener(
                "mouseup", 
                this._timeChangeEndHandler.bind(this)
        );
        this._audioFile.addEventListener(
                "timeupdate", 
                this._audioTimeUpdateHandler.bind(this)
        );
        this.playButton.addEventListener(
                "click", 
                this._playPauseButtonHandler.bind(this)
        );

        this.started = false;
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
            if (+this._eventTimeline[i]["time"] >= currTime) {
                this._currTimelineIdx = i;
                break;
            }
        }
    }

    // Handler function called when audioFile is fully loaded.
    _audioLoadedHandler() {
        this._audioLoading = false;
        if (this._startupWaitingForAudio) {
            this.startup();
        }
    }

    // Handler function when the events JSON file is loaded.
    //
    // response (JSON) - JSON response from the XMLHttpRequest.
    _eventsLoadedHandler(response) {
        // Get JSON events
        let jsonEvents = JSON.parse(response.responseText);
        if (!("events" in jsonEvents)) {
            console.error("AudioController: Json events file incorrect format");
            return;
        }

        // Register events to timeline
        let events = jsonEvents["events"];
        for (let event of events) {
            this.addTimelineEvent(event);
        }

        this._eventsFileLoading = false;
        if (this._startupWaitingForEvents) {
            this._startupWaitingForEvents = false;
            this.startup();
        }
    }

    _timeChangeStartHandler() {
        this._changingTime = true;
        this._audioFile.pause();
    }

    _timeChangeEndHandler() {
        let nextTime = this.timeSlider.value / this.timeSlider.max
                * this._audioFile.duration;
        this._audioFile.currentTime = nextTime;
        this._seekcurrTimelineIdx();

        // Execute previous continuous event
        let eventIdx = null;
        for (let i = 0; i < this._continuousEvents.length; ++i) {
            if (+this._continuousEvents[i]["time"]
                    >= this._audioFile.currentTime) {
                break;
            }

            eventIdx = i;
        }
        if (eventIdx !== null) {
            this.timelineEventHandler(this._continuousEvents[eventIdx]);
        }


        if (this._audioPlaying) {
            this._audioFile.play();
        }

        this._changingTime = false;
    }

    _audioTimeUpdateHandler() {
        // Update time slider value
        let nextVal = this._audioFile.currentTime / this._audioFile.duration
                * this.timeSlider.max;
        if (!this._changingTime) {
            this.timeSlider.value = nextVal;
        }

        // Check for timeline event trigger
        // While loop used to execute events that happen at the same time
        while (this._currTimelineIdx !== null) {
            if (this._audioFile.currentTime >= +this._eventTimeline
                    [this._currTimelineIdx]["time"]) {

                this.timelineEventHandler(
                        this._eventTimeline[this._currTimelineIdx]);

                ++this._currTimelineIdx;
                if (this._currTimelineIdx >= this._eventTimeline.length) {
                    this._currTimelineIdx = null;
                }
            }
            else {
                return;
            }
        }
    }

    _playPauseButtonHandler() {
        if (this._audioPlaying) {
            this._audioFile.pause();
            this._audioPlaying = false;
            this.paused = true;
        }
        else {
            this._audioFile.play();
            this._audioPlaying = true;
            this.paused = false;
        }
    }
}

export { AudioController }