// ImageGallery.js
// Author: Franz Alarcon

"use strict"

class ImageGallery {
    constructor(imageGalleryElement) {
        // Public data
        this.imageGalleryElement = imageGalleryElement

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

    // Add an image to the gallery.
    // 
    // image (HTML element) - Reference to the image HTML element.
    addImage(image) {
        this.imageGalleryElement.appendChild(image);
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