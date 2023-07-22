// Project Utilities
// Contains utility functions for accessing project data.
// Author: Franz Alarcon

let projectFileURL = "/resources/project-info/project-info.json";

// getAllProjects function
// Retrieves information from all projects. 
async function getAllProjects() {
    let response = await fetch(projectFileURL);
    if (!response.ok) {
        throw new Error("getAllProjects: Could not fetch project JSON file.");
    }

    let json = await response.json();
    return json;
}

export {
    getAllProjects
}