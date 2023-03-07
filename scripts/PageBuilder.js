// PageBuilder.js
// Contains classes and functions for building default web pages for this
//      portfolio. 
// Author: Franz Alarcon

import { AudioController } from "./AudioController.js"

"use strict"

// Flash an element on the page for a short duration.
// Use to grab the viewer's attention towards a specific element.
function flashElement(element) {
    let originalBackground = element.style.backgroundColor;
    let originalTransition = element.style.transition;

    element.style.transition = "background 0.2s";
    element.style.backgroundColor = "rgb(255, 244, 214)";

    setTimeout(function() {
        element.style.transition = "background 0.6s";
        element.style.backgroundColor = originalBackground;

        setTimeout(function() {
            element.style.transition = originalTransition;
        }, 600);
    }, 200);
}

// VirtualTourBuilder Class
// Used to construct the virtual tour system in a webpage.
class VirtualTourBuilder {
    constructor() {

        // Private data

        // HTML elements
        this._built = false;
        this._audio = null;
        this._controlsBox = null;
        this._playButton = null;
        this._exitButton = null;
        this._timeSlider = null;
        this._startupButton = null;

        // Play/pause images
        this._playImageDiv = null;
        this._pauseImageDiv = null;
        this._exitImageDiv = null;
    }

    buildVirtualTour(audioURL) {
        if (this._built) {
            return;
        }
        if (audioURL === undefined) {
            return;
        }

        // Load audio
        this._audio = new AudioController();
        this._audio.audioURL = audioURL;
        this._audio.timelineEventHandler = this._eventHandler;
        this._audio.loadAudio();
        
        // Controller box
        this._controlsBox = document.createElement("div");
        this._controlsBox.id = "virtual-tour-control-box";

        // Button Group
        let buttonGroup = document.createElement("div");
        buttonGroup.id = "virtual-tour-button-group";
        this._controlsBox.appendChild(buttonGroup);

        // Play Button
        this._playButton = document.createElement("button");
        this._playButton.id = "virtual-tour-play-button";
        this._playButton.classList.add("virtual-tour-control-button");
        this._audio.playButton = this._playButton;
        this._playButton.addEventListener("click", 
                this._updatePlayPauseButtonIcon.bind(this));
        buttonGroup.appendChild(this._playButton);
        
        // Exit Button
        this._exitButton = document.createElement("button");
        this._exitButton.id = "virtual-tour-exit-button";
        this._exitButton.classList.add("virtual-tour-control-button");
        this._exitButton.addEventListener("click",
                this.stopVirtualTour.bind(this));
        buttonGroup.appendChild(this._exitButton);

        // Time Slider
        this._timeSlider = document.createElement("input");
        this._timeSlider.id = "virtual-tour-time-slider";
        this._timeSlider.type = "range";
        this._timeSlider.min = "0";
        this._timeSlider.max = "200";
        this._timeSlider.value = "0";
        this._controlsBox.appendChild(this._timeSlider);
        this._audio.timeSlider = this._timeSlider;

        // Startup Button
        this._startupButton = document.createElement("button");
        this._startupButton.id = "virtual-tour-startup-button";
        this._startupButton.classList.add("button-1");
        this._startupButton.innerHTML = "Virtual Tour"
        this._startupButton.addEventListener("click",
                this.startVirtualTour.bind(this));
        
        // Add Startup button to document
        let startupButtonContainer = document.getElementById(
                "virtual-tour-startup-container");
        if (startupButtonContainer === null) {
            console.error("PageBuilder: Cannot find location for virtual tour"
                    + " startup button. There must be a div with id"
                    + " \"virtual-tour-startup-container\" in the document.");
        }
        else {
            startupButtonContainer.appendChild(this._startupButton);
        }

        // Load SVG images
        this._playImageDiv = document.createElement("div");
        this._playImageDiv.id = "virtual-tour-icon-container";
        fetch("../resources/images/page-builder-assets/play-button.svg")
            .then(response => {
                return response.text();
            })
            .then(svgText => {
                this._playImageDiv.innerHTML = svgText;
            })
            .catch(error => {
                console.error("PageBuilder: Could not get play button svg"
                        + " file, \n" + error);
            });
        
        this._pauseImageDiv = document.createElement("div");
        this._pauseImageDiv.id = "virtual-tour-icon-container";
        fetch("../resources/images/page-builder-assets/pause-button.svg")
            .then(response => {
                return response.text();
            })
            .then(svgText => {
                this._pauseImageDiv.innerHTML = svgText;
            })
            .catch(error => {
                console.error("PageBuilder: Could not get pause button svg"
                        + " file, \n" + error);
            });

        this._exitImageDiv = document.createElement("div");
        this._exitImageDiv.id = "virtual-tour-icon-container";
        fetch("../resources/images/page-builder-assets/exit-button.svg")
            .then(response => {
                return response.text();
            })
            .then(svgText => {
                this._exitImageDiv.innerHTML = svgText;
            })
            .catch(error => {
                console.error("PageBuilder: Could not get exit button svg"
                        + " file, \n" + error);
            });

        this._playButton.replaceChildren(this._playImageDiv);
        this._exitButton.replaceChildren(this._exitImageDiv);
    }

    loadEvents(eventsURL) {
        this._audio.loadEvents(eventsURL);
    }

    startVirtualTour() {
        // TODO: temp
        document.body.appendChild(this._controlsBox);
        this._audio.startup();
    }

    stopVirtualTour() {
        this._controlsBox.remove();
        this._audio.shutdown();
        // TODO: Finish
    }

    _updatePlayPauseButtonIcon() {
        if (this._audio.paused) {
            this._playButton.replaceChildren(this._pauseImageDiv);
        }
        else {
            this._playButton.replaceChildren(this._playImageDiv);
        }
    }

    _eventHandler(event) {
        let target = document.getElementById(event.targ);
        let invalidTargetError = "PageBuilder: Default event handler for"
                + "virtual tour could not find target \"" + event.target + "\"";

        if (event.type.includes("highlight")) {
            if (target == null) {
                console.error(invalidTargetError);
                return;
            }

            flashElement(target);
        }
        if (event.type.includes("focus")) {
            if (target == null) {
                console.error(invalidTargetError);
                return;
            }

            target.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }
}



export { VirtualTourBuilder }




// THIS FUNCTION IS INCOMPLETE
// MAY FINISH IN THE FUTURE BUT IT IS CURRENTLY UNNECESSARY

/*
// Build a project list section in an HTML container given a JSON project list
//      specifier. This project list JSON object contains project JSON objects
//      which describe each project and provides necessary resources.
// 
// Project List JSON Format:
//      projects (array): Array of project JSON objects
// 
// Project JSON Format:
//      name (string): Name of the project.
//      pageURL (string): URL to the project page.
//      imageURL (string, optional): URL to an image for the project listing.
//              Will be left empty if no image URL is provided.
//      description (string, optional): Brief description of the project.
// 
// projects (JSON) - Project list JSON object as formatted above.
// listContainer (HTML element) - HTML container to add the listed projects.
// className (string, optional) - String 
function buildProjectList(
        projects, 
        listContainer, 
        className = null, 
        fileLocation = null) {
    
    if (projects === undefined || listContainer === undefined) {
        console.error("buildProjectList: \'projects\' and/or \'listContainer\'"
                + " were undefnied");
        return;
    }
    if (!("projects" in projects)) {
        console.error("buildProjectList: The projects JSON object does not have"
                + " property \'projects\'. Incorrect format.");
        return;
    }

    let projectsList = projects.projects;
    for (let project of projectsList) {
        if (!("name" in project)) {
            console.error("buildProjectList: Project JSON object in projects"
                    + " list did not have \'name\' property. Incorrect format"
                    + " for,\n" + project);
            continue;
        }
        if (!("pageURL" in project)) {
            console.error("buildProjectList: Project JSON object in projects"
                    + " list did not have \'pageURL\' property. Incorrect"
                    + " format for,\n" + project);
            continue;
        }

        let linkElement = document.createElement("a");
        linkElement.classList.add("project-item");
        linkElement.href = project.pageURL;

        let divElement = document.createElement("div");
        divElement.classList.add("project-item-container");
        linkElement.appendChild(divElement);

        let imageElement = document.createElement("div");
        imageElement.classList.add("project-image-container");
        if ("imageURL" in project) {
            imageElement.appendChild(new Image(project.imageURL));
        }

        let nameElement = document.createElement("h3");
        nameElement.innerHTML = project.name;
    }
}
*/