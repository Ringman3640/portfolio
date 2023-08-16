// ElementUtilities.js
// Author: Franz Alarcon

import { registerImage, registerImageSet } from "/scripts/ImageGallery.js"

// fadeInPage global config
let fadeDurationMs = 50;

// fadeInPage function
// Fades out the page hider element on a page by setting the opacity to 0 with
//     a transition. After the element is fully opaque, it is removed.
// The page hider element is used to hide the DOM from the user in case there
//     needs to be additional javascript formatting.
// 
// The page hider element must be of ID "page-hider". If no element with this ID
//     is found, then the function does nothing.
function fadeInPage() {
    let target = document.getElementById("page-hider");
    if (!target) {
        return;
    }

    target.style.opacity = "0";
}

// addAnchorFadeOut function
// Applies a fade out effect for anchor elements when clicked.
// The fade out effect will turn the screen white for a short duration before
//     accessing the target href link.
// 
// Anchors with the "no-transition" class will be ignored.
// Anchors with target set to "_blank" will be ignored.
// 
// A "page-hider" element must exist on the DOM to apply the fade effect. If no
//     such element is found when this function is called, it will be created
//     and added to the DOM.
function addAnchorFadeOut() {
    // Get page-hider element
    // Create one if not found
    let hiderElement = document.getElementById("page-hider");
    if (!hiderElement) {
        hiderElement = document.createElement("div");
        hiderElement.id = "page-hider";
        hiderElement.style.opacity = "0";
        document.body.appendChild(hiderElement);
    }

    let elements = document.getElementsByTagName("a");
    for (let i = 0; i < elements.length; ++i) {
        if (elements[i].classList.contains("no-transition")) {
            return;
        }
        if (elements[i].target == "_blank") {
            return;
        }

        let targetURL = elements[i].href;
        elements[i].onclick = function() {
            hiderElement.style.opacity = "1";
            setTimeout(function() {
                location.href = targetURL;
            }, fadeDurationMs);
            return false;
        };
    }
}

// registerDisplayImage function
// Registers all display images currently within the DOM. All registered images
//     become clickable. When clicked, the images are displayed on the screen.
// Images can be registered as standalone or as a set. Images within a set are
//     linked to each other when displayed. This allows the viewer to provide
//     "next" and "previous" image buttons.
// 
// Images that will be registered must have one of the following two classes:
//     1. Standalone image:     display-image
//     2. Set image:            display-image-[set code]*
// 
// *[set code] is an identifier for an image set. This code can consist of all
//     non-whitespace characters. Specifically, the regex for the code is /\S+/.
// 
// Images with the same set code are part of the same image set. The order of
//     images within an image set is based on their order in the DOM.
function registerDisplayImages() {
    let displayImages = document.querySelectorAll("[class^='display-image'],"
            + " [class*=' display-image']");
    let imageSets = {};
    
    for (const image of displayImages) {

        // Register standalone images
        if (image.classList.contains("display-image")) {
            registerImage(image);
            continue;
        }

        // Otherwise, extract set code and add to imageSets
        let fullClassName = image.className.match(/display-image-\S+/);
        if (!fullClassName) {
            continue;
        }
        const setCodeStartIdx = 14;
        let setCode = fullClassName[0].substring(setCodeStartIdx);
        if (!(setCode in imageSets)) {
            imageSets[setCode] = [];
        }
        imageSets[setCode].push(image);
    }

    // Register all image sets
    for (const setCode in imageSets) {
        registerImageSet(imageSets[setCode]);
    }
}

// registerScalingText global config
let scaleEventListenerSet = false;
let fitScaleElements = new Set();
let shrinkScaleElements = new Map();

// registerScalingText function
// Registers all scaling text elements currently within the DOM. Scaling text
//     elements will change their text font size to fit its text contents within
//     the element width, accounting for size padding. There are two types of
//     scaling text options, specified with the following classes:
// 
//     1. fit-scale-text
//     2. shrink-scale-text
//
// fit-scale-text will resize the text contents such that it fully occupies the
//     element width. shrink-scale-text will keep the original font size of the
//     text until needs to be shrunk to fit the element width.
// 
// shrink-scale-text does not react to font-size changes while the text is
//     currently shrunk.
function registerScalingText() {
    if (!scaleEventListenerSet) {
        window.addEventListener("resize", scaleTextRoutine);
        scaleEventListenerSet = true;
    }

    let fitScaleText = document.querySelectorAll(
            "[class^='fit-scale-text']," + " [class*=' fit-scale-text']");
    for (let fitElement of fitScaleText) {
        fitElement.style.whiteSpace = "nowrap";
        fitElement.style.overflow = "hidden";
        fitScaleElements.add(fitElement);
    }

    let shrinkScaleText = document.querySelectorAll(
            "[class^='shrink-scale-text']," + " [class*=' shrink-scale-text']");
    for (const shrinkElement of shrinkScaleText) {
        shrinkElement.style.whiteSpace = "nowrap";
        shrinkElement.style.overflow = "hidden";
        let fontSize = parseFloat(window.getComputedStyle(shrinkElement)
            .getPropertyValue("font-size"));
        shrinkScaleElements.set(shrinkElement, {
            origFontSize: fontSize,         // Original font size before shrink
            seenFontSize: fontSize + "px"   // Last recorded font size. See 
                                            //     scaleTextRoutine() notes
        });
    }

    scaleTextRoutine();
}

// scaleTextRoutine function
// Routine function that applies scaling text behavior to registered scaling
//     text elements.
let minFontSize = 1;        // Needed to prevent infinitely shrinking text
function scaleTextRoutine() {
    for (let elem of fitScaleElements) {
        let elemStyle = window.getComputedStyle(elem);
        let fontSize = parseFloat(elemStyle.getPropertyValue("font-size"));
        let availableWidth = elem.clientWidth
                - parseFloat(elemStyle.getPropertyValue("padding-left"))
                - parseFloat(elemStyle.getPropertyValue("padding-right"));
        let scaler = availableWidth / getElementTextWidth(elem, elemStyle);

        let nextFontSize = fontSize * scaler;
        if (nextFontSize >= minFontSize) {
            elem.style.fontSize = nextFontSize + "px";
        }
        else {
            elem.style.fontSize = minFontSize + "px";
        }
    }

    for (let [elem, elemAttributes] of shrinkScaleElements) {
        let elemStyle = window.getComputedStyle(elem);
        let fontSize = parseFloat(elemStyle.getPropertyValue("font-size"));
        let availableWidth = elem.clientWidth
                - parseFloat(elemStyle.getPropertyValue("padding-left"))
                - parseFloat(elemStyle.getPropertyValue("padding-right"));
        let scaler = availableWidth / getElementTextWidth(elem, elemStyle);

        // Check if the observed font size is different from the last seen font
        //     size. This is to ensure origFontSize is updated if the CSS
        //     font size is changed externally while currently shrunk.
        if (elemAttributes.seenFontSize != elem.style.fontSize) {
            elemAttributes.origFontSize = fontSize;
        }
        
        // Only scale up to original font size. Otherwise, set font size to 
        //     original size.
        let nextFontSize = fontSize * scaler;
        if (nextFontSize > elemAttributes.origFontSize) {
            nextFontSize = elemAttributes.origFontSize;
        }

        // Check for minimum text size
        if (nextFontSize < minFontSize) {
            nextFontSize = minFontSize;
        }

        elem.style.fontSize = nextFontSize + "px";
        elemAttributes.seenFontSize = elem.style.fontSize;
    }
}

// getElementTextWidth function
// Calculates and returns the width of the provided element's innerHTML text
//     given its computed style.
// Helper function for scaleTextRoutine
let textWidthCanvas = document.createElement("canvas");
let textWidthContext = textWidthCanvas.getContext("2d");
function getElementTextWidth(elem, compStyle) {
    textWidthContext.font = compStyle.font;
    return textWidthContext.measureText(elem.textContent.trim()).width;
}

// applyBehavioralUtilities function
// Applies all utilities that are used setup a page. These include utilities
//     that are intended for use before the page fully loads in and utilities
//     that apply interaction behaviors to elements.
// All applications of utilities will not cause disruptive behavior in the event
//     of unformatted or non-present target elements in the DOM.
function applySetupUtilities() {
    addAnchorFadeOut();
    registerDisplayImages();
    registerScalingText();
}

export {
    fadeInPage,
    addAnchorFadeOut,
    registerDisplayImages,
    registerScalingText,
    applySetupUtilities
}