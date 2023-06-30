// *TEMP*js
// Javascript for the *TEMP* project page.

// Default imports
import { VirtualTourBuilder, buildNavBar } from "/scripts/PageBuilder.js"
import { applySetupUtilities, fadeInPage } from "/scripts/ElementUtilities.js"

// Additional imports (uncomment for use)
import { ImageGallery } from "/scripts/ImageGallery.js"

"use strict"

// let virtualTour = new VirtualTourBuilder();

let demoGallery = null;
let collisionGallery = null;

document.addEventListener("DOMContentLoaded", init);

function init() {
    // Build navigation bar
    buildNavBar();

    // Apply element utilities
    applySetupUtilities();

    // Build image galleries
    demoGallery = new ImageGallery(document.getElementById("demo-gallery"));
    demoGallery.loadImages("./carla-platoon/demo-gallery.json")

    collisionGallery = new ImageGallery(
            document.getElementById("collision-gallery"));
    collisionGallery.loadImages("./carla-platoon/collision-gallery.json")

    // Build virtual tour
    // virtualTour.buildVirtualTour("*TEMP*");
    // virtualTour.loadEvents("*TEMP*");

    // Fade in page contents
    fadeInPage();
}