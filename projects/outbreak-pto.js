// outbreak-pto.js
// Javascript for the Outbreak-PTO project page.

// Default imports
import { VirtualTourBuilder, buildNavBar } from "/scripts/PageBuilder.js"
import { applySetupUtilities, fadeInPage } from "/scripts/ElementUtilities.js"

// Additional imports (uncomment for use)
import { ImageGallery } from "/scripts/ImageGallery.js"

"use strict"

let virtualTour = new VirtualTourBuilder();
let characterGallery = null;
let otherGallery = null;
let unusedGallery = null;

document.addEventListener("DOMContentLoaded", init);

function init() {
    // Build navigation bar
    buildNavBar();

    // Apply element utilities
    applySetupUtilities();
    
    // Load image galleries
    characterGallery = new ImageGallery(
            document.getElementById("character-gallery"));
    characterGallery.loadImages("./outbreak-pto/character-gallery.json");

    otherGallery = new ImageGallery(
            document.getElementById("other-gallery"));
    otherGallery.loadImages("./outbreak-pto/other-gallery.json");
    
    unusedGallery = new ImageGallery(
            document.getElementById("unused-gallery"));
    unusedGallery.loadImages("./outbreak-pto/unused-gallery.json");

    // Build virtual tour
    // Currently disabled because I really don't like the way I sound. I will
    //     re-record it soon.
    /*
    virtualTour.buildVirtualTour("../resources/audio/outbreak-pto-project/"
            + "outbreak-pto-page-narration.mp3");
    virtualTour.loadEvents("./outbreak-pto/events.json");
    */

    // Fade in page contents
    fadeInPage();
}