import { ImageGallery } from "/scripts/ImageGallery.js"
import { VirtualTourBuilder, buildNavBar } from "/scripts/PageBuilder.js"

"use strict"

let pageBuilder = new VirtualTourBuilder();

document.addEventListener("DOMContentLoaded", init);

function init() {
    // Build navigation bar
    buildNavBar();

    // Build virtual tour
    // pageBuilder.buildVirtualTour("*TEMP*");
    // pageBuilder.loadEvents("*TEMP*");
}