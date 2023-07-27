import { buildNavBar } from "/scripts/PageBuilder.js"
import { fadeInPage, addAnchorFadeOut } from "/scripts/ElementUtilities.js"
import { ImageGallery } from "/scripts/ImageGallery.js"

let logicGallery = null;

document.addEventListener("DOMContentLoaded", init);

function init() {
    buildNavBar();

    logicGallery = new ImageGallery(document.getElementById("logic-gallery"))
    logicGallery.loadImages(
            "/resources/images/about-me/logic-gallery/logic-gallery.json");

    addAnchorFadeOut();
    fadeInPage();
}