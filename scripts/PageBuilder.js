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
        this._scrollButton = null;
        this._exitButton = null;
        this._timeSlider = null;
        this._startupButton = null;

        // Play/pause images
        this._playImageDiv = null;
        this._pauseImageDiv = null;
        this._scrollImageDiv = null;
        this._exitImageDiv = null;

        // State data
        this._autoScroll = true;
    }

    // Build the virtual tour system within the webpage.
    // The virtual tour is started with the startup button, which will be
    //      created on the page during the build. The button will be appended to
    //      an HTML element with id "virtual-tour-startup-container".
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
        this._audio.timelineEventHandler = this._eventHandler.bind(this);
        this._audio.playToggleHandler = 
                this._updatePlayPauseButtonIcon.bind(this);
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
        buttonGroup.appendChild(this._playButton);

        // Auto Scroll Button
        this._scrollButton = document.createElement("button");
        this._scrollButton.id = "virtual-tour-auto-scroll-button";
        this._scrollButton.classList.add("virtual-tour-control-button");
        this._scrollButton.addEventListener("click",
                this._toggleAutoScroll.bind(this));
        buttonGroup.appendChild(this._scrollButton);
        
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

        this._scrollImageDiv = document.createElement("div");
        this._scrollImageDiv.id = "virtual-tour-icon-container";
        fetch("../resources/images/page-builder-assets/auto-scroll-button.svg")
            .then(response => {
                return response.text();
            })
            .then(svgText => {
                this._scrollImageDiv.innerHTML = svgText;
            })
            .catch(error => {
                console.error("PageBuilder: Could not get exit button svg"
                        + " file, \n" + error);
            });

        this._playButton.replaceChildren(this._playImageDiv);
        this._scrollButton.replaceChildren(this._scrollImageDiv);
        this._exitButton.replaceChildren(this._exitImageDiv);

        // Apply auto scroll state
        let scrollState = localStorage.getItem("autoScroll");
        if (scrollState === null) {
            this.autoScroll = true;
            localStorage.setItem("autoScroll", "true")
        }
        else if (scrollState == "true") {
            this._autoScroll = true;
            this._scrollImageDiv.dataset.enabled = "true";
        }
        else {
            this._autoScroll = false;
            this._scrollImageDiv.dataset.enabled = "false";
        }
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
            this._playButton.replaceChildren(this._playImageDiv);
        }
        else {
            this._playButton.replaceChildren(this._pauseImageDiv);
        }
    }

    _toggleAutoScroll() {
        if (this._autoScroll) {
            this._autoScroll = false;
            this._scrollImageDiv.dataset.enabled = "false";
            localStorage.setItem("autoScroll", "false");
        }
        else {
            this._autoScroll = true;
            this._scrollImageDiv.dataset.enabled = "true";
            localStorage.setItem("autoScroll", "true");
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
            if (!this._autoScroll) {
                return;
            }

            target.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }
}

// initCopyClipboardButtons function
// Utility function for initializing copy clipboard buttons on the current
//      document.
// A copy clipboard button will copy text to the device clipboard on click.
// 
// Copy clipboard buttons must include the "copy-clipboard-button" class.
// Each button must have an attribute "data-clipboard-text" which specifies the
//      text to copy to the clipboard.
function initCopyClipboardButtons() {
    let elements = document.querySelectorAll(".copy-clipboard-button");
    let clipboard = navigator.clipboard;

    for (const element of elements) {
        element.addEventListener("click", (event) => {
            let copyText = element.getAttribute("data-clipboard-text");
            if (!copyText) {
                console.error("Copy clipboard button did not have"
                        + " \"data-clipboard-text\" attribuite.");
                return;
            }
            
            clipboard.writeText(copyText)
                .then(() => {
                    alert("Text copied to clipboard.");
                });
        });
    }
}

// buildNavBar function
// Building function for inserting the standard navigation bar into a page.
// 
// The DOM must contain an element with ID "nav-bar-container". This will
//     become the parent element of the navigation bar. 
function buildNavBar() {
    let container = document.getElementById("nav-bar-container");
    if (!container) {
        console.error("PageBuilder: Could not find container element for"
                + " navigation bar.");
        return;
    }

    // TODO: Add the links to each nav item when the page is created
    container.innerHTML = `
        <a href="/index.html">
            <h2>Home</h2>
        </a>
        <a href="/index.html">
            <h2>Projects</h2>
        </a>
        <a href="/index.html">
            <h2>About Me</h2>
        </a>
        <a href="/index.html">
            <h2>Contact</h2>
        </a>
    `;
}

// fadeOutPageHider function
// Fades out the page hider element on a page by setting the opacity to 0 with
//     a transition. After the element is fully opaque, it is removed.
// The page hider element is used to hide the DOM from the user in case there
//     needs to be additional javascript formatting.
// 
// The page hider element must be of ID "page-hider". If no element with this ID
//     is found, then the function does nothing.
function fadeOutPageHider() {
    let target = document.getElementById("page-hider");
    if (!target) {
        return;
    }

    target.style.opacity = "0";
    setTimeout(function() {
        target.remove();
    }, 500);
}

export {
    VirtualTourBuilder,
    initCopyClipboardButtons,
    buildNavBar,
    fadeOutPageHider
}




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