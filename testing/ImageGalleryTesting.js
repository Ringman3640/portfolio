import { ImageGallery } from "../scripts/ImageGallery.js";

document.addEventListener("DOMContentLoaded", init);

let gallery = null;

function init() {
    let image1 = new Image(100, 100);
    image1.src = "sus.jpg";

    let image2 = new Image(100, 100);
    image2.src = "sus2.png";

    let image3 = new Image(100, 100);
    image3.src = "anim.gif";

    let galleryElement = document.getElementById("imageGallery");
    gallery = new ImageGallery(galleryElement);
    gallery.addImage(image1);
    gallery.addImage(image2);
    gallery.addImage(image3);
}