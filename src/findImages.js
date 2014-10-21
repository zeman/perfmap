'use strict';

function findImages() {
    var tags = document.getElementsByTagName('*'),
        images = document.getElementsByTagName('img'),
        el,
        len,
        imgs = [];
    //re = /url\(([http].*)\)/ig;
    //re = /(url)\((.*?)\)/ig;

    imgs = getTagImages(document);
    len = tags.length;
    for (var j = 0; j < len; j++) {
        el = getBgElement(tags[j]);
        if (!!el && !!el.src) {
            var match = el.src.match(/\((.*?)\)/);
            if (match[1]) {
                el.src = match[1].replace(/('|")/g, '');
                /*if (style['visibility'] == "hidden") {
                    hasImage = 0;   
                } else {
                    hasImage = 1;
                    if (elem.tagName == 'BODY') {
                        body = 1;
                    }
                    imgs.push(el);
                }*/
                imgs.push(el);
            }
        }
    }


    //console.log(imgs);
    len = imgs.length;
    for (var i = 0; i < len; i++) {
        var entry = window.performance.getEntriesByName(imgs[i].src)[0];
        if (entry) {
            var xy = getCumulativeOffset(imgs[i].element, imgs[i].src);
            var wh = imgs[i].element.getBoundingClientRect();
            var width = wh.width;
            var height = wh.height;
            if (width > 10) {
                if (height > 10) {
                    placeMarker(xy, width, height, entry, imgs[i].element.tagName === 'BODY', imgs[i].src);
                }
            }
        }
    }
}