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
    applySetupUtilities();
    fadeInPage();
}