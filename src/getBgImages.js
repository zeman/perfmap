'use strict';
function getBgElement(el) {
    /*jshint sub: true */
    //console.log(el.className);
    var style = el.currentStyle || window.getComputedStyle(el, false);
    //console.log(style.getPropertyValue('background-image'));
    if (style.getPropertyValue('background-image')  !== 'none') {
        return {
                element: el,
                src: style.getPropertyValue('background-image')
            };
    }
    return null;
}