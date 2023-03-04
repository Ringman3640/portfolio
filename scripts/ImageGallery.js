// ImageGallery.js
// Author: Franz Alarcon

"use strict"

// ImageNode class
// Represents a single node within the ImageList data structure
// Helper class for ImageList
class ImageNode {
    constructor(image = null) {
        this.image = image;
        this.prev = null;
        this.next = null;
    }
}

// ImageList class
// A list of images sorted according to a unique rank identifier.
// Images with lower ranks are placed before images with higher ranks.
//
// This class is used to ensure image order consistency when loadImages() is
//      called in ImageGallery. Since the images need to be fetched through the
//      internet, they may not be finished loading in the same order everytime.
//      This linked list implementation will ensure that each image is sorted
//      internally and externally based on the time the fetch is first called.
//      The original array implementation was inconsitent.
// Bruh why did I make this class this is overkill
class ImageList {
    constructor() {
        this._count = 0;
        this._head = null;
        this._tail = null;
    }

    // Add an image to the list.
    // 
    // Returns the newly-created ImageNode if successful.
    // Returns null if unsuccessful.
    // 
    // image (HTML element) - Reference to the image HTML element.
    // rank (int) - Rank of the image*.
    // 
    // *The rank of an image is a unique identifier for each image, used by
    //      default to sort the images.
    // *The rank will be applied to the image as a data attribute.
    addImage(image, rank) {
        if (this._count === 0) {
            this._head = new ImageNode();
            this._tail = this._head;
            this._head.image = image;
            this._head.image.dataset.rank = rank;
            ++this._count;
            return this._head;
        }

        // Check if next head
        if (+rank < +this._head.image.dataset.rank) {
            let nextHead = new ImageNode();
            nextHead.image = image;
            nextHead.image.dataset.rank = rank;
            nextHead.next = this._head;
            this._head.prev = nextHead;
            this._head = nextHead;
            ++this._count;
            return this._head;
        }

        // Seach for position
        let currNode = this._head;
        while (currNode != null) {
            if (rank == currNode.image.dataset.rank) {
                return null;
            }
            if (+rank < +currNode.image.dataset.rank) {
                let newNode = new ImageNode();
                newNode.image = image;
                newNode.image.dataset.rank = rank;
                newNode.prev = currNode.prev;
                newNode.next = currNode;
                currNode.prev.next = newNode;
                currNode.prev = newNode;
                ++this._count;
                return newNode;
            }
            currNode = currNode.next;
        }

        // Image is new tail
        let newTail = new ImageNode();
        newTail.image = image;
        newTail.image.dataset.rank = rank;
        newTail.prev = this._tail;
        this._tail.next = newTail;
        this._tail = newTail;
        ++this._count;
        return this._tail;
    }

    // Get an ImageNode from the list.
    // 
    // imageRank (int) - Rank of the image to get
    getImageNode(imageRank) {
        let currNode = this._head;
        while (currNode != null) {
            if (currNode.image.dataset.rank == imageRank) {
                return currNode;
            }
            currNode = currNode.next;
        }

        // ImageNode not found
        return null;
    }
}

// ImageGallery class
// Creates and maintains image gallery sections within an HTML file.
// Allows images to be added to the gallery dynamically by passing pre-made
//      image HTML elements or by referencing a gallery JSON file that
//      specifies the image locations and inforamtion.
// Clicking on images within the gallery will display the image to the user and
//      allow the user to slideshow through the images.
class ImageGallery {

    // Constructor
    // 
    // imageGalleryElement (HTML element) - HTML container for the image gallery
    constructor(imageGalleryElement) {
        if (imageGalleryElement == undefined) {
            console.error("ImageGallery: Must provide image gallery HTML"
                    + " container element on construction.");
            return;
        }

        // Public data
        this.imageGalleryElement = imageGalleryElement;

        // Private data
        this._nextImageRank = 0;
        this._imageList = new ImageList();
        this._imageViewerNode = null;
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

        this._testList = new ImageList();

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
    // rank (int, optional) - Sorting rank of the image.
    addImage(image, rank) {
        let imageRank = rank;
        if (imageRank === undefined) {
            imageRank = this._nextImageRank++;
        }

        image.classList.add("gallery-image");
        let imageNode = this._imageList.addImage(image, imageRank);
        if (imageNode === null) {
            console.error("ImageGallery: Could not add image to gallery (likely"
                    + " rank conflict).");
            return;
        }

        image.addEventListener("click", this._imageClicked.bind(this, 
            imageNode));

        let imageContainer = document.createElement("div");
        imageContainer.className = "image-container";
        imageContainer.dataset.rank = imageRank;
        imageContainer.appendChild(image);
        this._appendImageToGallery(imageContainer, imageRank);
    }

    // Handler for keydown events.
    // Allows for image viewer button operation through keyboard.
    _keypressHandler(key) {
        if (this._imageViewerNode == null) {
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
            let imageRank = this._nextImageRank++;
            image.onload = function() {
                self.addImage(this, imageRank);
            }
            image.onerror = function(error) {
                console.error("ImageGallery: Cannot find image from given url"
                        + " in gallery JSON file.");
            }
            image.src = rootURL + imageJson.url;
        }
    }

    // imageNode (ImageNode) - ImageNode of clicked image.
    _imageClicked(imageNode) {
        if (imageNode === null) {
            console.error("ImageGallery: Image clicked but image was null.");
            return;
        }

        this._imageViewerNode = imageNode;
        this._setViewerImage(imageNode.image);
        this._setViewerButtonsDisabled();
        document.body.appendChild(this._imageViewerElement);
    }

    _viewerNextImage() {
        if (this._imageViewerNode === null) {
            console.error("ImageGallery: Tried to get next image but the"
                    + " current image is null.");
            return;
        }
        if (this._imageViewerNode.next === null) {
            console.error("ImageGallery: Tried to get next image but there"
                    + " is no next image.");
            return;
        }

        this._imageViewerNode = this._imageViewerNode.next;
        this._setViewerButtonsDisabled();
        this._setViewerImage(this._imageViewerNode.image);
    }

    _viewerPrevImage() {
        if (this._imageViewerNode === null) {
            console.error("ImageGallery: Tried to get previous image but the"
                    + " current image is null.");
            return;
        }
        if (this._imageViewerNode.prev === null) {
            console.error("ImageGallery: Tried to get previous image but there"
                    + " is no previous image.");
            return;
        }

        this._imageViewerNode = this._imageViewerNode.prev;
        this._setViewerButtonsDisabled();
        this._setViewerImage(this._imageViewerNode.image);
    }

    _viewerExit() {
        this._imageViewerElement.remove();
        this._imageViewerNode = null;
    }

    // Set the current image in the image viewer.
    // Helper method
    // 
    // image (HTML element) - HTML image to show on viewer.
    _setViewerImage(image) {
        this._imageViewerFrame.replaceChildren(image.cloneNode(true));
    }

    // Set the disabled status for the prev and next image viewer buttons.
    // Helper method
    _setViewerButtonsDisabled() {
        if (this._imageViewerNode === null) {
            return;
        }

        if (this._imageViewerNode.next === null) {
            this._imageViewerNextButton.disabled = true;
        }
        else {
            this._imageViewerNextButton.disabled = false;
        }

        if (this._imageViewerNode.prev === null) {
            this._imageViewerPrevButton.disabled = true;
        }
        else {
            this._imageViewerPrevButton.disabled = false;
        }
    }
    
    // Append an image container to the correct location within the gallery
    //      based on its rank.
    // Helper method
    // 
    // imageContainer (HTML element) - Div container with image as child
    // rank (int) - Sorting rank of the image
    _appendImageToGallery(imageContainer, rank) {
        this.imageGalleryElement.appendChild(imageContainer);
        
        for (const child of this.imageGalleryElement.children) {
            if (+child.dataset.rank > +rank) {
                this.imageGalleryElement.insertBefore(imageContainer, child);
                return;
            }
        }
    }
}

export { ImageGallery }