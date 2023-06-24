// ElementUtilities.js
// Author: Franz Alarcon

let fadeDurationMs = 50;

// fadeInPage function
// Fades out the page hider element on a page by setting the opacity to 0 with
//     a transition. After the element is fully opaque, it is removed.
// The page hider element is used to hide the DOM from the user in case there
//     needs to be additional javascript formatting.
// 
// The page hider element must be of ID "page-hider". If no element with this ID
//     is found, then the function does nothing.
function fadeInPage() {
    let target = document.getElementById("page-hider");
    if (!target) {
        return;
    }

    target.style.opacity = "0";
}

// addAnchorFadeOut function
// Applies a fade out effect for anchor elements when clicked.
// The fade out effect will turn the screen white for a short duration before
//     accessing the target href link.
// 
// Anchors with the "no-transition" class will be ignored.
// Anchors with target set to "_blank" will be ignored.
// 
// A "page-hider" element must exist on the DOM to apply the fade effect. If no
//     such element is found when this function is called, it will be created
//     and added to the DOM.
function addAnchorFadeOut() {
    // Get page-hider element
    // Create one if not found
    let hiderElement = document.getElementById("page-hider");
    if (!hiderElement) {
        hiderElement = document.createElement("div");
        hiderElement.id = "page-hider";
        hiderElement.style.opacity = "0";
        document.body.appendChild(hiderElement);
    }

    let elements = document.getElementsByTagName("a");
    for (let i = 0; i < elements.length; ++i) {
        if (elements[i].classList.contains("no-transition")) {
            return;
        }
        if (elements[i].target == "_blank") {
            return;
        }

        let targetURL = elements[i].href;
        elements[i].onclick = function() {
            hiderElement.style.opacity = "1";
            setTimeout(function() {
                location.href = targetURL;
            }, fadeDurationMs);
            return false;
        };
    }
}

export { fadeInPage, addAnchorFadeOut }