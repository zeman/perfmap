'use strict';

function getCumulativeOffset(obj, url) {
    var left, top;
    left = top = 0;
    if (obj.offsetParent) {
        do {
            left += obj.offsetLeft;
            top += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    if (0 === top) {
        left += gZeroLeft;
        top += gZeroTop;
    }
    return {
        left: left,
        top: top,
    };
}