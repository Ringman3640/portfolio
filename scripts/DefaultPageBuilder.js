// DefaultPageBuilder.js
// Contains classes and functions for buiilding default web pages for this
//      portfolio. 
// Author: Franz Alarcon

"use strict"

class DefaultPageBuilder {
    constructor() {

    }
}

export { DefaultPageBuilder as default }






// THIS FUNCTION IS INCOMPLETE
// MAY FINISH IN THE FUTURE BUT IT IS CURRENTLY UNNECESSARY

/*
// Build a project list section in an HTML container given a JSON project list
//      specifier. This project list JSON object contains project JSON objects
//      which describe each project and provides necessary resources.
// 
// Project List JSON Format:
//      projects (array): Array of project JSON objects
// 
// Project JSON Format:
//      name (string): Name of the project.
//      pageURL (string): URL to the project page.
//      imageURL (string, optional): URL to an image for the project listing.
//              Will be left empty if no image URL is provided.
//      description (string, optional): Brief description of the project.
// 
// projects (JSON) - Project list JSON object as formatted above.
// listContainer (HTML element) - HTML container to add the listed projects.
// className (string, optional) - String 
function buildProjectList(
        projects, 
        listContainer, 
        className = null, 
        fileLocation = null) {
    
    if (projects === undefined || listContainer === undefined) {
        console.error("buildProjectList: \'projects\' and/or \'listContainer\'"
                + " were undefnied");
        return;
    }
    if (!("projects" in projects)) {
        console.error("buildProjectList: The projects JSON object does not have"
                + " property \'projects\'. Incorrect format.");
        return;
    }

    let projectsList = projects.projects;
    for (let project of projectsList) {
        if (!("name" in project)) {
            console.error("buildProjectList: Project JSON object in projects"
                    + " list did not have \'name\' property. Incorrect format"
                    + " for,\n" + project);
            continue;
        }
        if (!("pageURL" in project)) {
            console.error("buildProjectList: Project JSON object in projects"
                    + " list did not have \'pageURL\' property. Incorrect"
                    + " format for,\n" + project);
            continue;
        }

        let linkElement = document.createElement("a");
        linkElement.classList.add("project-item");
        linkElement.href = project.pageURL;

        let divElement = document.createElement("div");
        divElement.classList.add("project-item-container");
        linkElement.appendChild(divElement);

        let imageElement = document.createElement("div");
        imageElement.classList.add("project-image-container");
        if ("imageURL" in project) {
            imageElement.appendChild(new Image(project.imageURL));
        }

        let nameElement = document.createElement("h3");
        nameElement.innerHTML = project.name;
    }
}
*/