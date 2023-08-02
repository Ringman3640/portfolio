import { buildNavBar } from "/scripts/PageBuilder.js"
import { fadeInPage, addAnchorFadeOut } from "/scripts/ElementUtilities.js"
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

function buildProjectsList(json) {
    let projectGroups = {};

    // Group projects by year
    for (let project of json.projects) {
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

    applyProjectStripAnimations();
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
                    <h1 class="project-strip-title">${name}</h1>
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
}

function applyProjectStripAnimations() {
    let projectStrips = document.getElementsByClassName("project-strip");
    let closedStripHeight = undefined;

    for (let projectStrip of projectStrips) {

        // Obtain initial strip height from first processed strip
        if (closedStripHeight === undefined) {
            closedStripHeight = projectStrip.offsetHeight;
        }

        let startupTimer = null;
        let openInterval = null;
        let closeInterval = null;

        let targetOpenHeight = closedStripHeight;

        projectStrip.addEventListener("mouseenter", () => {
            startupTimer = setTimeout(() => {

                targetOpenHeight = computeStripOpenHeight(projectStrip);
                if (closeInterval != null) {
                    clearInterval(closeInterval);
                }
                projectStrip.style.zIndex = "1";
                openInterval = setInterval(() => {
                    let currentHeight = projectStrip.offsetHeight;
                    if (currentHeight >= targetOpenHeight) {
                        projectStrip.style.height = targetOpenHeight + "px";
                        clearInterval(openInterval);
                    }
                    else {
                        projectStrip.style.height = currentHeight + 10 + "px";
                    }
                }, 10); // 10ms between frame changes

            }, 500); // 500ms of hovering before open animation
        });
        projectStrip.addEventListener("mouseleave", () => {
            if (startupTimer != null) {
                clearTimeout(startupTimer);
            }
            if (openInterval != null) {
                clearInterval(openInterval);
            }
            if (projectStrip.offsetHeight > closedStripHeight) {
                closeInterval = setInterval(() => {
                    let currentHeight = projectStrip.offsetHeight;
                    if (currentHeight <= closedStripHeight) {
                        projectStrip.style.height = closedStripHeight + "px";
                        projectStrip.style.zIndex = "0";
                        clearInterval(closeInterval);
                    }
                    else {
                        projectStrip.style.height = currentHeight - 10 + "px";
                    }
                }, 10); // 10ms between frame changes
            }
        });
    }
}

function computeStripOpenHeight(projectStrip) {
    // From testing, scrollHeight seems to be off by +5 units from the actual
    //     content height. 
    return projectStrip.scrollHeight - 5;
}