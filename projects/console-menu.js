// console-menu.js
// Javascript for the Console Menu project page.

// Default imports
import { VirtualTourBuilder, buildNavBar } from "/scripts/PageBuilder.js"
import { applySetupUtilities, fadeInPage } from "/scripts/ElementUtilities.js"

// Additional imports (uncomment for use)
// ImageGallery: Use to load-in a set of images to the page as an image gallery.
// import { ImageGallery } from "/scripts/ImageGallery.js"

"use strict"

// let virtualTour = new VirtualTourBuilder();

document.addEventListener("DOMContentLoaded", init);

function init() {
    // Build navigation bar
    buildNavBar();

    // Apply element utilities
    applySetupUtilities();

    // Build virtual tour
    // virtualTour.buildVirtualTour("*TEMP*");
    // virtualTour.loadEvents("*TEMP*");

    // Fade in page contents
    fadeInPage();
}