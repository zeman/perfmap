'use strict';

function getTagImages(document) {
    var images = document.getElementsByTagName('img'),
        imgs = [];
    for (var i = 0; i < images.length; i++) {
        if (!!images[i].src) {
            imgs.push({
                element: images[i],
                src: images[i].src
            });
        }
    }
    return imgs;
}