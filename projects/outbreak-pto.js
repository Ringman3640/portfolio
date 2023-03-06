import { ImageGallery } from "../scripts/ImageGallery.js"
//import { DefaultPageBuilder } from "../scripts/DefaultPageBuilder.js"

"use strict"

document.addEventListener("DOMContentLoaded", init);

let characterGallery = null;
let otherGallery = null;
let unusedGallery = null;

function init() {
    characterGallery = new ImageGallery(
            document.getElementById("character-gallery"));
    characterGallery.loadImages("./outbreak-pto/character-gallery.json");

    otherGallery = new ImageGallery(
            document.getElementById("other-gallery"));
    otherGallery.loadImages("./outbreak-pto/other-gallery.json");
    
    unusedGallery = new ImageGallery(
            document.getElementById("unused-gallery"));
    unusedGallery.loadImages("./outbreak-pto/unused-gallery.json");
}