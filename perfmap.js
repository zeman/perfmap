var gZeroLeft = 0;
var gZeroTop = 0;
var gWinWidth = window.innerWidth || document.documentElement.clientWidth;

function markElements(type) {
    var aElems = document.getElementsByTagName(type);
    for ( var i=0, len = aElems.length; i < len; i++ ) {
        var elem = aElems[i];
        if ( "link" == type && "stylesheet" != elem.rel ) {
            continue;
        }
        var url = elem.src || elem.href;
        if ( url ) {
            var entry = performance.getEntriesByName(url)[0];
            if ( entry ) {
                var xy = getCumulativeOffset(elem);
                var wh = elem.getBoundingClientRect();
                var width = wh.width;
                var height = wh.height;
                if(width > 20){
	                if(height > 20){
		                placeMarker(xy, width, height, type, entry);
	                }
                }
            }
        }
    }
}

function placeMarker(xy, width, height, type, entry) {
	
	var heat = entry.responseEnd / loaded;
	if(width < 170){
		var padding = 12;
		var size = 12;
	}else{
		var padding = 9;
		var size = 18;
	}
    var marker = document.createElement("div");
    marker.style.cssText = "position: absolute; box-sizing: border-box; color: #000; padding-left:10px; padding-right:10px; line-height:14px; font-size: " + size + "px; font-weight:800; text-align:center; opacity: 0.85; " + heatmap(heat) + " top: " + xy.top + "px; left: " + xy.left + "px; width: " + width + "px; height:" + height + "px; padding-top:" + ((height/2)-padding) + "px; z-index: 4000;";
    marker.innerHTML = parseInt(entry.responseEnd) + "ms (" + parseInt(entry.duration) + "ms)";
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
    if ( heat < 0.125 ) {
        return "background: #d73c4c;"
    }
    else if ( heat < 0.25 ) {
        return "background: #f66d3a;"
    }
    else if ( heat < 0.375 ) {
        return "background: #ffaf59;"
    }
    else if ( heat < 0.5 ) {
        return "background: #ffe185;"
    }
    else if ( heat < 0.625 ) {
        return "background: #e6f693;"
    }
    else if ( heat < 0.75 ) {
        return "background: #aadea2;"
    }
   else if ( heat < 0.875 ) {
        return "background: #62c3a5;"
    }else{
	    return "background: #2c87bf;"
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
            //console.log(obj);
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

markElements("img");
//markElements("script");
//markElements("link");