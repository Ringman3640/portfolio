import { initCopyClipboardButtons } from "./scripts/PageBuilder.js";

document.addEventListener("DOMContentLoaded", init);

// Document element references
let bannerTextContainer = null;
let introText = null;
let nameText = null;
let profText = null;

// Used in fitFontSize()
let totalPaddingWidth = null;

function init() {
    bannerTextContainer = document.getElementById("home-banner-text");
    introText = document.getElementById("home-banner-text-intro");
    nameText = document.getElementById("home-banner-text-name");
    profText = document.getElementById("home-banner-text-profession");

    totalPaddingWidth = window.getComputedStyle(nameText)
            .getPropertyValue("padding-left");
    totalPaddingWidth = parseInt(totalPaddingWidth, 10);
    totalPaddingWidth *= 2;

    initCopyClipboardButtons();
    resizeBannerText();
    window.addEventListener("resize", resizeBannerText);
}

// Resize the text on the front page banner to fit its target with.
// Target widths of the text is defined by specified percentage of the
//      containing element's width (see const vars below).
const introWidth = 0.4;     // "Hello, I'm"
const nameWidth = 0.8;      // "Franz Alarcon"
const profWidth = 0.8;      // "Software Developer"
function resizeBannerText() {
    let containerWidth = bannerTextContainer.offsetWidth;
    if (containerWidth == 0) {
        return;
    }
    fitFontSize(introText, containerWidth * introWidth);
    fitFontSize(nameText, containerWidth * nameWidth);
    fitFontSize(profText, containerWidth * profWidth);

    let temp = document.getElementById("home-banner-img-container").offsetHeight;
    console.log(bannerTextContainer.offsetHeight + " " + temp);
}

function fitFontSize(element, maxWidth) {
    let scaler = (maxWidth - totalPaddingWidth) 
            / (element.offsetWidth - totalPaddingWidth);
    let fontSize = parseFloat(window.getComputedStyle(element)
            .getPropertyValue("font-size"));
    element.style.fontSize = (fontSize * scaler) + "px";
}