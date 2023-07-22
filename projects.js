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

    console.log(mainSection);
    mainSection.appendChild(groupingContainer);
}