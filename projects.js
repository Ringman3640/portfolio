import { buildNavBar } from "/scripts/PageBuilder.js"
import { fadeInPage, addAnchorFadeOut, registerScalingText } from "/scripts/ElementUtilities.js"
import { getAllProjects } from "/scripts/ProjectUtilities.js"

document.addEventListener("DOMContentLoaded", init);

let mainSection = null;

function init() {
    mainSection = document.getElementsByClassName("main-section")[0];
    if (mainSection == null) {
        console.error("init: Could not find main section div");
    }

    getAllProjects()
        .then(json => {
            buildProjectsList(json);
        })
        .catch(error => {
            console.error("init: Unable to get projects from getAllProjects()");
            console.error(error);
        });

    buildNavBar();
    addAnchorFadeOut();
    fadeInPage();
}

function buildProjectsList(projectArray) {
    let projectGroups = {};

    // Group projects by year
    for (let project of projectArray) {
        if (!("completeYear" in project) || project.completeYear == "") {
            continue;
        }

        let projYear = project.completeYear;
        if (!(projYear in projectGroups)) {
            projectGroups[projYear] = [];
        }

        projectGroups[projYear].push(project);
    }

    // Order years descending
    let orderedYears = [];
    for (let year in projectGroups) {
        orderedYears.push(year);
    }
    orderedYears.sort(function(a, b) {
        return b - a;
    });

    // Add grouped projects to page
    for (let year of orderedYears) {
        buildProjectStripGrouping(year, projectGroups[year]);
    }

    // Only apply hover animations if device can hover
    if (window.matchMedia("(hover: hover)").matches) {
        applyProjectStripAnimations();
    }
}

function buildProjectStripGrouping(groupLabel, projects) {
    // Build grouping container and label
    let groupingContainer = document.createElement("div");
    groupingContainer.className = "project-grouping";
    groupingContainer.innerHTML = `
        <h1 class="project-grouping-label">
            ${groupLabel}
        </h1>
    `;

    // Build project strip list
    for (let project of projects) {
        let pageURL = project.pageURL;
        let name = project.name;
        let type = project.projectType;
        let description;
        let thumbnailURL = project.thumbnailURL;

        if ("longDescription" in project && project.longDescription != "") {
            description = project.longDescription;
        }
        else {
            description = project.shortDescription;
        }

        groupingContainer.innerHTML += `
            <div class="project-strip-container">
                <a href="${pageURL}" class="project-strip">
                    <h1 class="project-strip-title shrink-scale-text">${name}</h1>
                    <h2 class="project-strip-type">${type}</h2>
                    <p class="project-strip-description">
                        ${description}
                    </p>
                    <div class="project-strip-background-container">
                        <img src="${thumbnailURL}" 
                                class="project-strip-background">
                    </div>
                </a>
            </div>
        `;
    }

    mainSection.appendChild(groupingContainer);
    registerScalingText();
}

function applyProjectStripAnimations() {
    let projectStrips = document.getElementsByClassName("project-strip");
    let closedStripHeight = undefined;
    let transitionIncrementPx = 10;
    let transitionIntervalMs = 10;

    for (let projectStrip of projectStrips) {

        // Obtain initial strip height from first processed strip
        if (closedStripHeight === undefined) {
            closedStripHeight = projectStrip.offsetHeight;
        }

        let startupTimer = null;
        let openInterval = null;
        let closeInterval = null;

        let targetOpenHeight = closedStripHeight;

        projectStrip.addEventListener("mouseover", () => {
            startupTimer = setTimeout(() => {

                // From testing, scrollHeight seems to be off by +5 units from
                //     the actualcontent height. 
                targetOpenHeight = projectStrip.scrollHeight - 5;

                if (closeInterval != null) {
                    clearInterval(closeInterval);
                    closeInterval = null;
                }
                projectStrip.style.zIndex = "1";

                // Open tranision animation
                openInterval = setInterval(() => {
                    projectStrip.style.height = projectStrip.offsetHeight
                            + transitionIncrementPx + "px";
                    if (projectStrip.offsetHeight >= targetOpenHeight) {
                        projectStrip.style.height = targetOpenHeight + "px";
                        clearInterval(openInterval);
                        openInterval = null;
                    }
                }, transitionIntervalMs);

            }, 300); // 300ms of hovering before open animation
        });
        projectStrip.addEventListener("mouseout", () => {
            if (startupTimer != null) {
                clearTimeout(startupTimer);
                startupTimer = null;
            }
            if (openInterval != null) {
                clearInterval(openInterval);
                openInterval = null;
            }
            if (closeInterval == null 
                    && projectStrip.offsetHeight > closedStripHeight) {

                // Close strip transition animation
                closeInterval = setInterval(() => {
                    projectStrip.style.height = projectStrip.offsetHeight
                            - transitionIncrementPx + "px";
                    if (projectStrip.offsetHeight <= closedStripHeight) {
                        projectStrip.style.height = closedStripHeight + "px";
                        projectStrip.style.zIndex = "0";
                        clearInterval(closeInterval);
                        closeInterval = null;
                    }
                }, transitionIntervalMs);
            }
        });
    }
}

function computeStripOpenHeight(projectStrip) {
    // From testing, scrollHeight seems to be off by +5 units from the actual
    //     content height. 
    return projectStrip.scrollHeight - 5;
}
