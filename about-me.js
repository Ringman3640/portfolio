import { buildNavBar } from "/scripts/PageBuilder.js"
import { fadeInPage, addAnchorFadeOut } from "/scripts/ElementUtilities.js"

document.addEventListener("DOMContentLoaded", init);

function init() {
    buildNavBar();
    addAnchorFadeOut();
    fadeInPage();
}