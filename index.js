import { initCopyClipboardButtons } from "/scripts/PageBuilder.js";
import { fadeInPage, applySetupUtilities } from "/scripts/ElementUtilities.js"

document.addEventListener("DOMContentLoaded", init);

// Document element references
let bannerContainer = null;
let textContainer = null;
let introText = null;
let nameText = null;
let profText = null;
let profContainer = null;
let profImg = null;

// Used in fitBannerText()
let totalBannerPaddingWidth = null;
let totalTextPaddingWidth = null;

function init() {
    bannerContainer = document.getElementById("home-banner-container");
    textContainer = document.getElementById("home-banner-text");
    introText = document.getElementById("home-banner-text-intro");
    nameText = document.getElementById("home-banner-text-name");
    profText = document.getElementById("home-banner-text-profession");
    profContainer = document.getElementById("home-banner-img-container");
    profImg = document.getElementById("home-banner-img");

    totalBannerPaddingWidth = window.getComputedStyle(bannerContainer)
            .getPropertyValue("padding");
    totalBannerPaddingWidth = parseInt(totalBannerPaddingWidth, 10);
    totalBannerPaddingWidth *= 2;

    totalTextPaddingWidth = window.getComputedStyle(nameText)
            .getPropertyValue("padding-left");
    totalTextPaddingWidth = parseInt(totalTextPaddingWidth, 10);
    totalTextPaddingWidth *= 2;

    initCopyClipboardButtons();
    window.addEventListener("resize", resizeBanner);

    applySetupUtilities();
    resizeBanner();
    fadeInPage();
}

// Resize the home page banner dynamically to fit the width of the view port.
// Scales the banner text and banner image according to the following data 
//      attribtues:

// Width distribution
// Defines the percentage of how much the banner text will cover the total 
//      viewport width. The remaining width is taken by the banner image.
const textContentPercent = 0.7;

// Individual text element scaling
// Defines the width of each text element relative to its allotted space.
const introTextWidth = 0.25;     // "Hello, I'm"
const nameTextWidth = 0.85;      // "Franz Alarcon"
const profTextWidth = 0.85;      // "Software Developer"
const minTextSize = 1;

// Name-Profession gap
// Defines the gap between the name and profession text of he banner based as
//      a percentage of the text width.
const nameProfGap = 0.05;

function resizeBanner() {
    // This seems very unnecessary but imma just be sure
    if (window.innerWidth <= 0) {
        return;
    }

    // Calculate usable width considering padding
    let usableWidth = window.innerWidth - totalBannerPaddingWidth;

    // Apply percentage name-profession text gap
    nameText.style.marginBottom = (usableWidth * nameProfGap) + "px";

    // Resize profile image height to match text height
    profContainer.style.height = textContainer.offsetHeight + "px";

}