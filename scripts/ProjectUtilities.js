// Project Utilities
// Contains utility functions for accessing project data.
// Author: Franz Alarcon

let projectFileURL = "/resources/project-info/project-info.json";

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
    let response = await fetch(projectFileURL);
    if (!response.ok) {
        throw new Error("getAllProjects: Could not fetch project JSON file.");
    }

    let json;
    try {
        json = await response.json();
    } catch(error) {
        throw new Error("getAllProjects: Could not read project file as JSON.");
    }
    return json.projects;
}

export {
    getAllProjects
}