import { ImageGallery } from "../scripts/ImageGallery.js";

document.addEventListener("DOMContentLoaded", init);

let gallery = null;

function init() {
    let image1 = new Image();
    image1.src = "sus.jpg";

    let image2 = new Image();
    image2.src = "sus2.png";

    let image3 = new Image();
    image3.src = "anim.gif";
    image3.classList.add("pixel-art");

    let galleryElement = document.getElementById("imageGallery");
    gallery = new ImageGallery(galleryElement);
    gallery.addImage(image1);
    gallery.addImage(image2);
    gallery.addImage(image3);
}