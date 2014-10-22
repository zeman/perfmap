
;(function(window, document, undefined){
'use strict';

var perfMap = {},
    loading,
    loaded,
    gZeroLeft = 0,
    gZeroTop = 0,
    hArr = [{
        threashold: 0.16,
        value: '#1a9850',
        rgba: 'rgba(26, 152, 80, 0.95)'
    }, {
        threashold: 0.32,
        value: '#66bd63',
        rgba: 'rgba(102, 189, 99, 0.95)'
    }, {
        threashold: 0.48,
        value: '#a6d964',
        rgba: 'rgba(166, 217, 100, 0.95)'
    }, {
        threashold: 0.64,
        value: '#fdae61',
        rgba: 'rgba(253, 174, 97, 0.95)'
    }, {
        threashold: 0.8,
        value: '#f46d43',
        rgba: 'rgba(244, 109, 67, 0.95)'
    }, {
        threashold: 1.1,
        value: '#d73027',
        rgba: 'rgba(215, 48, 39, 0.95)'
    }];


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
            el.bgImg = el.src;

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
            //var xy = getCumulativeOffset(imgs[i].element, imgs[i].src);
            var wh = imgs[i].element.getBoundingClientRect();
            var width = wh.width;
            var height = wh.height;
            if (width > 10) {
                if (height > 10) {
                    placeMarker(width, height, entry, imgs[i].element.tagName === 'BODY', imgs[i].src, imgs[i]);
                }
            }
        }
    }
}


function getBgElement(el) {
    /*jshint sub: true */
    //console.log(el.className);
    var style = el.currentStyle || window.getComputedStyle(el, false);
    //console.log(style.getPropertyValue('background-image'));
    if (style.getPropertyValue('background-image') !== 'none') {
        return {
            element: el,
            src: style.getPropertyValue('background-image'),
            position: style.getPropertyValue('background-position')
        };
    }
    return null;
}


/*function getCumulativeOffset(obj, url) {
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
}*/


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


function heatmap(heat) {
    function findIndex(array, predicate) {
        var index = -1,
            length = array ? array.length : 0;
        while (++index < length) {
            if (predicate(array[index], index, array)) {
                return array[index];
            }
        }
        return array[length - 1];
    }

    return findIndex(hArr, function(chr) {
        return heat < chr.threashold;
    });
}


perfMap.init = function() {
    startLoading();
    // build heatmap
    findImages();

    // remove loading message
    loading.remove();

    // mouse events to move timeline around on hover
    var elements = document.getElementsByClassName('perfmap');
    var timeline = document.getElementById('perfmap-timeline');
    var timelineLeft;
    for (var i = 0, len = elements.length; i < len; i++) {
        elements[i].onmouseover = function() {
            timelineLeft = document.documentElement.clientWidth * (this.dataset.ms / loaded);
            if (this.dataset.body !=='1') {
                //this.style.opacity = 1;
                this.style.cssText = this.style.cssText.replace(/(\d\.\d*)\)/g, '0.1)');
                timeline.style.cssText = 'opacity:1; transition: 0.5s ease-in-out; transform: translate(' + parseInt(timelineLeft) + 'px,0); position:absolute; z-index:4; border-left:2px solid white; height:100%;';
            }
            
        };
        elements[i].onmouseout = function() {
            timelineLeft = document.documentElement.clientWidth * (this.dataset.ms / loaded);
            if (this.dataset.body !== '1') {
                //this.style.opacity = 0.925;
                this.style.cssText = this.style.cssText.replace(/(\d\.\d*)\)/g, '0.95)');
                timeline.style.cssText = 'opacity:0; transition: 0.5s ease-in-out; transform: translate(' + parseInt(timelineLeft) + 'px,0); position:absolute; z-index:4; border-left:2px solid white; height:100%;';
            }
            
        };
    }
};


function placeMarker(width, height, entry, body, url, el) {
    //background-image: linear-gradient(90deg, rgba(253, 174, 97, 0.95), rgba(253, 174, 97, 0.95));
    var heat = (entry.responseEnd / loaded),
        marker = document.createElement('div'),
        padding = 9,
        size = 18,
        paddingTop,
        opacity = 0.925,
        align = 'center',
        bodyText = '';

    // adjust size of fonts/padding based on width of overlay
    if (width < 170) {
        padding = 12;
        size = 12;
    } else if (width > 400) {
        padding = 13;
        size = 26;
    }

    // check for overlay that matches viewport and assume it's like a background image on body
    if ((width === document.documentElement.clientWidth) && (height >= document.documentElement.clientHeight)) {
        body = true;
    }

    // adjust opacity if it's the body element and position label top right
    paddingTop = (height / 2) - padding;
    if (!!body) {
        opacity = 0.6;
        size = 18;
        align = 'right';
        paddingTop = 10;
        bodyText = 'BODY ';
    }
    var elem = el.element;
    //debugger;
    var oldClass = elem.className;
    elem.className = oldClass + ' perfmap';
    elem.setAttribute('data-ms', parseInt(entry.responseEnd));
    elem.setAttribute('data-body', (body ? 1 : 0));
    var oldStyle = elem.style.cssText;
    var bgImg = '';
    if (!!el.bgImg) {
        bgImg = ', ' + el.bgImg;
    } else {
        //debugger;
        bgImg = ', url("' + elem.src + '") ';

        var style = elem.currentStyle || window.getComputedStyle(elem, false);
        //console.log(style.getPropertyValue('background-image'));
        oldStyle += 'width: ' + (style.getPropertyValue('width') || width + 'px') + '!important;';
        oldStyle += 'height: ' + ( style.getPropertyValue('height') || height + 'px') + '!important;';
        elem.removeAttribute("src");
    }
    var bgPosition = 'background-position: 0px 0px';
    if (!!el.position) {
        bgPosition += ', ' + el.position;
    }

    elem.style.cssText = oldStyle + ' background-image: linear-gradient(' + heatmap(heat).rgba + ', ' + heatmap(heat).rgba + ')' + bgImg + '; ' + bgPosition + '; background-size: contain;';
    //elem.style.cssText = 'position:absolute; transition: 0.5s ease-in-out; box-sizing: border-box; color: #fff; padding-left:10px; padding-right:10px; line-height:14px; font-size: ' + size + 'px; font-weight:800; font-family:"Helvetica Neue",sans-serif; text-align:' + align + '; opacity: ' + opacity + '; background: ' + heatmap(heat).value + '; top: ' + xy.top + 'px; left: ' + xy.left + 'px; width: ' + width + 'px; height:' + height + 'px; padding-top:' + paddingTop + 'px; z-index: 4000;';
    // if (width > 50) {
    //     if (height > 15) {
    //         oldStyle = elem.style.cssText;
    //         elem.style.cssText =  oldStyle + ' content: "' + bodyText + parseInt(entry.responseEnd) + 'ms (' + parseInt(entry.duration) + 'ms)";';
    //     }
    // }
    //document.body.appendChild(marker);
}


function startLoading() {

    // give visual feedback asap
    loading = document.createElement('div');
    loading.id = 'perfmap-loading';
    loading.innerHTML = 'Creating PerfMap';
    loading.style.cssText = 'position:absolute; z-index:6000; left:40%; top:45%; background-color:#000; color:#fff; padding:20px 30px; font-family:"Helvetica Neue",sans-serif; font-size:24px; font-weight:800;border:2px solid white;';
    document.body.appendChild(loading);

    // get full page load time to calculate heatmap max
    loaded = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;

    // backend
    var backend = window.performance.timing.responseEnd - window.performance.timing.navigationStart;
    var backendLeft = (backend / loaded) * 100;
    var paint, firstPaint, firstPaintLeft;

    // first paint in chrome from https://github.com/addyosmani/timing.js
    if (window.chrome && window.chrome.loadTimes) {
        paint = window.chrome.loadTimes().firstPaintTime * 1000;
        firstPaint = paint - (window.chrome.loadTimes().startLoadTime * 1000);
        firstPaintLeft = (firstPaint / loaded) * 100;
    }

    // remove any exisiting "perfmap" divs on second click
    var elements = document.getElementsByClassName('perfmap');
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }

    // build bottom legend
    var perfmap = document.createElement('div');
    perfmap.id = 'perfmap';
    perfmap.style.cssText = 'position: fixed; width:100%; bottom:0; left:0; z-index:5000; height: 25px; color:#fff; font-family:"Helvetica Neue",sans-serif; font-size:14px; font-weight:800; line-height:14px;';
    perfmap.innerHTML = '<div style="width:16.666666667%; height: 50px; float:left; background-color:#1a9850;"></div><div style="width:16.666666667%; height: 50px; float:left; background-color:#66bd63;"></div><div style="width:16.666666667%; height: 50px; float:left; background-color:#a6d96a;"></div><div style="width:16.666666667%; height: 50px; float:left; background-color:#fdae61;"></div><div style="width:16.666666667%; height: 50px; float:left; background-color:#f46d43;"></div><div style="width:16.666666667%; height: 50px; float:left; background-color:#d73027;"></div><div style="position:absolute; z-index:2; right:0px; padding-top:5px; padding-right:10px;height:100%;color:#fff;">Fully Loaded ' + parseInt(loaded) + 'ms</div><div style="position:absolute; z-index:3; left:' + firstPaintLeft + '%; padding-top:5px; border-left:2px solid white;padding-left:5px;height:100%;color:#fff;">First Paint ' + parseInt(firstPaint) + 'ms</div><div id="perfmap-timeline" style="position:absolute; z-index:4; left:-100px; border-left:2px solid white;height:100%;"></div>';
    document.body.appendChild(perfmap);


}

window.perfMap = perfMap;
})(window, document);
perfMap.init();