import { initCopyClipboardButtons } from "/scripts/PageBuilder.js";
import { fadeInPage, applySetupUtilities, registerScalingText } from "/scripts/ElementUtilities.js";
import { getFavoriteProjects } from "/scripts/ProjectUtilities.js";

document.addEventListener("DOMContentLoaded", init);

function init() {
    getFavoriteProjects()
        .then(projects => {
            buildProjectCardSet(projects);
        });
    initCopyClipboardButtons();
    applySetupUtilities();
    fadeInPage();
}

function buildProjectCardSet(projects) {
    let cardSetContainer = document.getElementById("project-card-listings");
    for (let project of projects) {
        cardSetContainer.innerHTML += `
        <div class="project-card-container">
            <a href="${ project.pageURL }" class="project-card">
                <div class="square-container">
                    <div class="square-content">
                        <img src="${ project.thumbnailURL }" 
                            alt="Thumbnail image for ${ project.name } project.">
                    </div>
                </div>
                <h2 class="shrink-scale-text">
                    ${ project.name }
                </h2>
                <p>
                    ${ project.shortDescription }
                </p>
            </a>
        </div>
        `;
    }

    registerScalingText();
}