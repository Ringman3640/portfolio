import { initCopyClipboardButtons } from "./scripts/PageBuilder.js";

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
    resizeBanner();
    window.addEventListener("resize", resizeBanner);
}

// Resize the home page banner dynamically to fit the width of the view port.
// Scales the banner text and banner image according to the following data 
//      attribtues:

// Width distribution
// Defines the percentage of how much the banner text will cover the total 
//      viewport width. The remaining width is taken by the banner image.
const textContentPercent = 0.7;

// Text-image gap
// Defines the gap between the text content and the profile image (in px).
// The gap cuts equally into both regions of the text and image.
const textImageGap = 20;

// Individual text element scaling
// Defines the width of each text element relative to its allotted space.
const introTextWidth = 0.25;     // "Hello, I'm"
const nameTextWidth = 0.8;      // "Franz Alarcon"
const profTextWidth = 0.8;      // "Software Developer"
const minTextSize = 1;

function resizeBanner() {
    // This seems very unnecessary but imma just be sure
    if (window.innerWidth <= 0) {
        return;
    }

    // Distribute available viewport width to text and profile containers.
    let usableWidth = window.innerWidth - totalBannerPaddingWidth 
            - textImageGap;
    let textWidth = usableWidth * textContentPercent;
    let profWidth = usableWidth - textWidth;
    textContainer.style.width = textWidth + "px";
    profContainer.style.width = profWidth + "px";

    // Resize text elements to fit text container width
    let containerWidth = textContainer.offsetWidth;
    if (containerWidth == 0) {
        return;
    }
    fitBannerText(introText, containerWidth * introTextWidth);
    fitBannerText(nameText, containerWidth * nameTextWidth);
    fitBannerText(profText, containerWidth * profTextWidth);

    // Resize profile image height to match text height
    profContainer.style.height = textContainer.offsetHeight + "px";
}

function fitBannerText(element, maxWidth) {
    let scaler = (maxWidth - totalTextPaddingWidth) 
            / (element.offsetWidth - totalTextPaddingWidth);
    let fontSize = parseFloat(window.getComputedStyle(element)
            .getPropertyValue("font-size"));
    fontSize *= scaler;

    // Need to check if fontSize < 1 to prevent infinite downsizing. This would
    //      typically affect the into text and make it invisibly small in 
    //      certain resizes.
    if (fontSize < minTextSize) {
        fontSize = minTextSize;
    }
    element.style.fontSize = fontSize + "px";
}