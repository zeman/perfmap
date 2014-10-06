var gZeroLeft = 0;
var gZeroTop = 0;
var gWinWidth = window.innerWidth || document.documentElement.clientWidth;

function findImages() {
    var aElems = document.getElementsByTagName('*');
    var re = /url\((http.*)\)/ig;
    for ( var i=0, len = aElems.length; i < len; i++ ) {
        var elem = aElems[i];
        var style = window.getComputedStyle(elem);
        var url = elem.src || elem.href;
        var hasImage = 0;
        re.lastIndex = 0; // reset state of regex so we catch repeating spritesheet elements
        if (elem.tagName == 'IMG') {
        	hasImage = 1;
		}
		if (style['background-image']) {
        	var backgroundImage = style['background-image'];
			var matches = re.exec(style['background-image']);
			if (matches && matches.length > 1){
				url = backgroundImage.substring(4);
				url = url.substring(0, url.length - 1);
				hasImage = 1;
			}
		}
		if(hasImage == 1){
	        if ( url ) {
	            var entry = performance.getEntriesByName(url)[0];
	            if ( entry ) {
	                var xy = getCumulativeOffset(elem);
	                var wh = elem.getBoundingClientRect();
	                var width = wh.width;
	                var height = wh.height;
	                if(width > 10){
		                if(height > 10){
			                placeMarker(xy, width, height, entry);
		                }
	                }
	            }
	        }
	    }
    }
}

function placeMarker(xy, width, height, entry) {
	var heat = entry.responseEnd / loaded;
	if(width < 170){
		var padding = 12;
		var size = 12;
	}else if(width > 400){
		var padding = 13;
		var size = 26;
	}else{
		var padding = 9;
		var size = 18;
	}
    var marker = document.createElement("div");
    marker.className = "perfmap";
    marker.style.cssText = "position: absolute; box-sizing: border-box; color: #fff; padding-left:5px; padding-right:5px; line-height:14px; font-size: " + size + "px; font-weight:800; font-family:\"Helvetica Neue\",sans-serif; text-align:center; opacity: 0.95; " + heatmap(heat) + " top: " + xy.top + "px; left: " + xy.left + "px; width: " + width + "px; height:" + height + "px; padding-top:" + ((height/2)-padding) + "px; z-index: 4000;";
    if(width > 50){
    	if(height > 15 ){
    		marker.innerHTML = parseInt(entry.responseEnd) + "ms (" + parseInt(entry.duration) + "ms)";
    	}
    }
    document.body.appendChild(marker);
    if ( 0 == xy.top ) {
        gZeroLeft += marker.offsetWidth + 10;
        if ( gZeroLeft + 100 > gWinWidth ) {
            gZeroTop += 30;
            gZeroLeft = 0;
        }
    }
}

function prettyType(type) {
    return ( "link" == type ? "stylesheet" : type );
}

function heatmap(heat) {
    if ( heat < 0.16 ) {
        return "background: #1a9850;"
    }
    else if ( heat < 0.32 ) {
        return "background: #66bd63;"
    }
    else if ( heat < 0.48 ) {
        return "background: #a6d96a;"
    }
    else if ( heat < 0.64 ) {
        return "background: #fdae61;"
    }
    else if ( heat < 0.8 ) {
        return "background: #f46d43;"
    }else{
	    return "background: #d73027;"
    }
}

function typeCss(type) {
    if ( "img" == type ) {
        return "background: #C00;"
    }
    else if ( "script" == type ) {
        return "background: #0C0;"
    }
    else if ( "link" == type ) {
        return "background: #00C;"
    }
}

function getCumulativeOffset(obj) {
    var left, top, width;
    left = top = 0;
    if (obj.offsetParent) {
        do {
            left += obj.offsetLeft;
            top  += obj.offsetTop;
            width += obj.offsetWidth;
        } while (obj = obj.offsetParent);
    }

    if ( 0 == top ) {
        left += gZeroLeft;
        top += gZeroTop;
    }

    return {
        left: left,
        top: top,
        width: width,
    };
}

// get full page load time to calculate heatmap max
var loaded = performance.timing.loadEventEnd - performance.timing.navigationStart;

// remove any exisiting "perfmap" divs on second click
var elements = document.getElementsByClassName("perfmap");
while(elements.length > 0){
    elements[0].parentNode.removeChild(elements[0]);
}

// build heatmap
findImages();