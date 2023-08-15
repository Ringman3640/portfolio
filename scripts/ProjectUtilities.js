// Project Utilities
// Contains utility functions for accessing project data.
// Author: Franz Alarcon

let projectFileURL = "/resources/project-info/project-info.json";
let projectJson = null;

// getAllProjects function
// Retrieves information from all projects. 
// Returns an array of all available project objects. Each project object has
//     the following object attribtues:
// 
//      - name: Name of the project
//      - pageURL: URL of the project page
//      - shortDescription: A short description describing the project
//      - longDescription: A longer description with more information
//      - projectType: The type of project (e.g. "Group Assignment")
//      - completeYear: Year that the project was completed or first published
//      - thumbnailURL: URL to a thumbnail image
async function getAllProjects() {
    if (!projectJson) {
        await loadProjectJson();
    }

    return projectJson.projects;
}

// getFavoriteProjects function
// Retrieves information from all favorite projects.
// Returns an array of the listed favorite projects, each containing the same
//     attributes as detailed in getAllProjects.
async function getFavoriteProjects() {
    if (!projectJson) {
        await loadProjectJson();
    }
    
    let favoriteList = [];
    for (let projectNameObj of projectJson.favoriteProjects) {
        let projectName = projectNameObj.name;
        for (let project of projectJson.projects) {
            if (project.name != projectName) {
                continue;
            }

            favoriteList.push(project);
            break;
        }
    }

    return favoriteList;
}

// loadProjectJson function
// Loads the project Json file to projectJson.
// Helper function for getAllProjects and getFavoriteProjects.
async function loadProjectJson() {
    let response = await fetch(projectFileURL);
    if (!response.ok) {
        throw new Error("getAllProjects: Could not fetch project JSON file.");
    }

    try {
        projectJson = await response.json();
    } catch(error) {
        throw new Error("getAllProjects: Could not read project file as JSON.");
    }
}

export {
    getAllProjects,
    getFavoriteProjects
}