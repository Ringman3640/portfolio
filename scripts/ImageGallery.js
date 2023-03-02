// ImageGallery.js
// Author: Franz Alarcon

"use strict"

class ImageGallery {
    constructor(imageGalleryElement) {
        // Public data
        this.imageGalleryElement = imageGalleryElement;

        // Private data
        this._imageList = [];
        this._imageViewerIdx = null;
        this._imageViewerElement = document.createElement("div");
        this._imageViewerFrame = document.createElement("div");
        this._imageViewerPrevButton = document.createElement("button");
        this._imageViewerNextButton = document.createElement("button");
        this._imageViewerExitButton = document.createElement("button");

        // Build image viewer element
        this._imageViewerElement.classList.add("image-viewer");
        this._imageViewerFrame.classList.add("image-viewer-frame");
        this._imageViewerPrevButton.classList.add("image-viewer-prev");
        this._imageViewerNextButton.classList.add("image-viewer-next");
        this._imageViewerExitButton.classList.add("image-viewer-exit");
        this._imageViewerElement.appendChild(this._imageViewerFrame);
        this._imageViewerElement.appendChild(this._imageViewerPrevButton);
        this._imageViewerElement.appendChild(this._imageViewerNextButton);
        this._imageViewerElement.appendChild(this._imageViewerExitButton);

        // Set event listeners
        document.addEventListener("keydown", this._keypressHandler.bind(this));
        this._imageViewerNextButton.addEventListener("click", 
                this._viewerNextImage.bind(this));
        this._imageViewerPrevButton.addEventListener("click", 
                this._viewerPrevImage.bind(this));
        this._imageViewerExitButton.addEventListener("click", 
                this._viewerExit.bind(this));
    }

    // Load in a list of images to the image gallery from a specified gallery
    //      JSON file.
    // The gallery JSON file must consist of a JSON object with an "images"
    //      property. This property contains an array of image JSON objects,
    //      which specify the URL of the location and, optionally, alt text and
    //      classes.
    // The gallery JSON object may also contain the optional property "rootURL", 
    //      which specifies a string to prepend to each image URL. Indicate if
    //      the URL is relative with the "relativeURL" bool property (assumed to
    //      be false if not provided). If the URL is relative, the directory of
    //      the images will be relative to the gallery JSON file.
    //
    // Gallery JSON Format:
    //      images (array): List of image JSON objects
    //      rootURL (string, optional): URL to prepend to each image URL
    //      relativeURL (bool, optional): Indicate if the rootURL is relative
    // 
    // Image JSON Format:
    //      url (string): URL path to the image
    //      alt (string, optional): alt text to add to the image
    //      class (string, optional): HTML class to add to the image
    //      classes (array, optional): Array of HTML classes to add to the image
    // 
    // imagesURL (string) - URL to the JSON image list.
    loadImages(galleryURL) {
        if (galleryURL === undefined) {
            console.error("ImageGallery: galleryURL is not specified when"
                    + " calling loadImages().");
            return;
        }

        let responseURL = "";
        fetch(galleryURL)
            .then(response => {
                responseURL = response.url;
                return response.json();
            })
            .then(galleryJson => {
                this._galleryJsonLoadHandler(galleryJson, responseURL);
            })
            .catch(error => {
                console.error("ImageGallery: Unable to load images from JSON"
                        + " file, \n", error);
            })
    }

    // Add an image to the gallery.
    // The image will be contained within a div with the class
    //      "image-container". This div will then be appended to the specified
    //      image gallery element as a child. The image will have the class
    //      "gallery-image".
    // 
    // image (HTML element) - Reference to the image HTML element.
    addImage(image) {
        let imageContainer = document.createElement("div");
        imageContainer.className = "image-container";
        imageContainer.appendChild(image);

        this.imageGalleryElement.appendChild(imageContainer);
        this._imageList.push(image);

        image.classList.add("gallery-image");
        image.addEventListener("click", this._imageClicked.bind(this, 
                this._imageList.length - 1));
    }

    // Handler for keydown events.
    // Allows for image viewer button operation through keyboard.
    _keypressHandler(key) {
        if (this._imageViewerIdx == null) {
            return;
        }

        // Right arrow
        if (key.keyCode == 39 && !this._imageViewerNextButton.disabled) {
            this._viewerNextImage();
            return;
        }

        // Left arrow
        if (key.keyCode == 37 && !this._imageViewerPrevButton.disabled) {
            this._viewerPrevImage();
            return;
        }

        // Esc
        if (key.keyCode == 27) {
            this._viewerExit();
            return;
        }
    }


    // Handler for processing the gallery JSON object fetched from loadImages().
    // Loads images from the gallery JSON object list and adds them to the
    //      image gallery element.
    //
    // galleryJson (JSON) - Gallery JSON object fetched from the gallery JSON
    //      file.
    // galleryURL (string) - URL path to the gallery JSON file*.
    //
    // *galleryURL is needed to get the rootURL for relative paths.
    _galleryJsonLoadHandler(galleryJson, galleryURL) {
        if (!("images" in galleryJson)) {
            console.error("ImageGallery: Gallery JSON file does not have"
                    +" \"images\" property.");
            return;
        }

        let rootURL = "";
        if ("rootURL" in galleryJson) {
            if ("relativeURL" in galleryJson && galleryJson.relativeURL) {
                // THIS TOOK SO LONG TO FIGURE OUT IT IS 2 AM
                // I HATE URLS
                let urlPath = new URL(galleryJson.rootURL, galleryURL);
                rootURL = urlPath.toString();
            }
            else {
                rootURL = galleryJson.rootURL;
            }
            
            if (!rootURL.endsWith("/")) {
                rootURL += "/";
            }
        }

        for (let imageJson of galleryJson.images) {
            if (!("url" in imageJson)) {
                console.error("ImageGallery: Image JSON object does not have"
                        + " \"url\" property from gallery JSON");
                continue;
            }

            let image = new Image();
            if ("alt" in imageJson) {
                image.alt = imageJson.alt;
            }
            if ("class" in imageJson) {
                image.className = imageJson.class;
            }
            if ("classes" in imageJson) {
                for (let className of imageJson.classes) {
                    image.classList.add(className);
                }
            }

            let self = this;
            image.onload = function() {
                self.addImage(this);
            }
            image.onerror = function(error) {
                console.error("ImageGallery: Cannot find image from given url"
                        + " in gallery JSON file.");
            }
            image.src = rootURL + imageJson.url;
        }
    }

    _imageClicked(imageIdx) {
        this._imageViewerIdx = imageIdx;
        this._setViewerImage(this._imageList[imageIdx]);
        this._setViewerButtonsDisabled();
        document.body.appendChild(this._imageViewerElement);
    }

    _viewerNextImage() {
        if (this._imageViewerIdx === null) {
            console.error("ImageGallery: Tried to get next image but the"
                    + "current image is null.");
            return;
        }

        ++this._imageViewerIdx;
        if (+this._imageViewerIdx > +this._imageList.length - 1) {
            console.error("ImageGallery: No next image.");
            return;
        }
        
        this._setViewerButtonsDisabled();
        this._setViewerImage(this._imageList[this._imageViewerIdx]);
    }

    _viewerPrevImage() {
        if (this._imageViewerIdx === null) {
            console.error("ImageGallery: Tried to get previous image but the"
                    + "current image is null.");
            return;
        }

        --this._imageViewerIdx;
        if (+this._imageViewerIdx < 0) {
            console.error("ImageGallery: No previous image.");
            return;
        }
        
        this._setViewerButtonsDisabled();
        this._setViewerImage(this._imageList[this._imageViewerIdx]);
    }

    _viewerExit() {
        this._imageViewerElement.remove();
        this._imageViewerIdx = null;
    }

    // Set the current image in the image viewer.
    // Helper method
    _setViewerImage(image) {
        this._imageViewerFrame.replaceChildren(image.cloneNode(true));
    }

    // Set the disabled status for the prev and next image viewer buttons.
    // Helper method
    _setViewerButtonsDisabled() {
        if (+this._imageViewerIdx == +this._imageList.length - 1) {
            this._imageViewerNextButton.disabled = true;
        }
        else {
            this._imageViewerNextButton.disabled = false;
        }

        if (+this._imageViewerIdx == 0) {
            this._imageViewerPrevButton.disabled = true;
        }
        else {
            this._imageViewerPrevButton.disabled = false;
        }
    }
}

export { ImageGallery }