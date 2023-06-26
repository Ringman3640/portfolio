import { ImageGallery } from "/scripts/ImageGallery.js"
import { VirtualTourBuilder, buildNavBar } from "/scripts/PageBuilder.js"
import { fadeInPage, addAnchorFadeOut, registerDisplayImages } from "/scripts/ElementUtilities.js"

"use strict"

let pageBuilder = new VirtualTourBuilder();

document.addEventListener("DOMContentLoaded", init);

function init() {
    // Build navigation bar
    buildNavBar();

    // Apply element effects
    addAnchorFadeOut();
    registerDisplayImages();

    // Build virtual tour
    // pageBuilder.buildVirtualTour("*TEMP*");
    // pageBuilder.loadEvents("*TEMP*");

    // Fade in page contents
    fadeInPage();
}