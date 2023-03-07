import { ImageGallery } from "../scripts/ImageGallery.js"
import { VirtualTourBuilder } from "../scripts/PageBuilder.js"

"use strict"

let pageBuilder = new VirtualTourBuilder();
let characterGallery = null;
let otherGallery = null;
let unusedGallery = null;

document.addEventListener("DOMContentLoaded", init);

function init() {
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
    pageBuilder.buildVirtualTour("../resources/audio/outbreak-pto-project/"
            + "outbreak-pto-page-narration.mp3");
}