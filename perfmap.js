var gZeroLeft = 0;
var gZeroTop = 0;
var gWinWidth = window.innerWidth || document.documentElement.clientWidth;

function findImages() {
    var aElems = document.getElementsByTagName('*');
    var re = /url\(("?http.*"?)\)/ig;
    for ( var i=0, len = aElems.length; i < len; i++ ) {
        var elem = aElems[i];
        var style = window.getComputedStyle(elem);
        var url = elem.src || elem.href;
        var hasImage = 0;
        var fixed = 0;
        var body = 0;
        re.lastIndex = 0; // reset state of regex so we catch repeating spritesheet elements
        if(elem.tagName == 'IMG') {
            hasImage = 1;
        }
        if(style['backgroundImage']) {
            var backgroundImage = style['backgroundImage'];
            var matches = re.exec(style['backgroundImage']);
            if (matches && matches.length > 1){
                url = backgroundImage.substring(4);
                url = url.substring(0, url.length - 1);
                url = url.replace(/"/, "");
                url = url.replace(/"/, "");
                hasImage = 1;
                if(elem.tagName == 'BODY'){
                    body = 1;
                }
            }
        }
        if(style['visibility'] == "hidden") {
            hasImage = 0;
        }
        if(hasImage == 1){
            if ( url ) {
                var entry = performance.getEntriesByName(url)[0];
                if ( entry ) {
                    var xy = getCumulativeOffset(elem, url);
                    var wh = elem.getBoundingClientRect();
                    var width = wh.width;
                    var height = wh.height;
                    if(width > 10){
                        if(height > 10){
                            placeMarker(xy, width, height, entry, body, url);
                        }
                    }
                }
            }
        }
    }
}

function placeMarker(xy, width, height, entry, body, url) {
    var heat = entry.responseEnd / loaded;
    // adjust size of fonts/padding based on width of overlay
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
    // check for overlay that matches viewport and assume it's like a background image on body
    if(width == document.documentElement.clientWidth){
        if(height >= document.documentElement.clientHeight){
            body = 1;
        }
    }
    // adjust opacity if it's the body element and position label top right
    if(body == 1){
        var opacity = 0.6;
        var size = 18;
        var align = "right";
        var paddingTop = 10;
        var bodyText = "BODY ";
    }else{
        var opacity = 0.925;
        var align = "center";
        var paddingTop = (height/2)-padding;
        var bodyText = "";
    }
    var marker = document.createElement("div");
    marker.className = "perfmap";
    marker.setAttribute("data-ms", parseInt(entry.responseEnd));
    marker.setAttribute("data-body", body);
    marker.setAttribute("dir", "ltr"); // Force LTR display even if injected on an RTL page
    marker.style.cssText = "position:absolute; transition: 0.5s ease-in-out; box-sizing: border-box; color: #fff; padding-left:10px; padding-right:10px; line-height:14px; font-size: " + size + "px; font-weight:800; font-family:\"Helvetica Neue\",sans-serif; text-align:" + align + "; opacity: " + opacity + "; " + heatmap(heat) + " top: " + xy.top + "px; left: " + xy.left + "px; width: " + width + "px; height:" + height + "px; padding-top:" + paddingTop + "px; z-index: 4000;";
    if(width > 50){
        if(height > 15 ){
            marker.innerHTML = bodyText + parseInt(entry.responseEnd) + "ms (" + parseInt(entry.duration) + "ms)";
        }
    }
    document.body.appendChild(marker);
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

function getCumulativeOffset(obj, url) {
    var left, top;
    left = top = 0;
    if (obj.offsetParent) {
        do {
            left += obj.offsetLeft;
            top  += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    if ( 0 == top ) {
        left += gZeroLeft;
        top += gZeroTop;
    }
    return {
        left: left,
        top: top,
    };
}

// give visual feedback asap
var loading = document.createElement("div");
loading.id = "perfmap-loading";
loading.innerHTML = "Creating PerfMap";
loading.style.cssText = "position:absolute; z-index:6000; left:40%; top:45%; background-color:#000; color:#fff; padding:20px 30px; font-family:\"Helvetica Neue\",sans-serif; font-size:24px; font-weight:800;border:2px solid white;";
document.body.appendChild(loading);

// get full page load time to calculate heatmap max
var loaded = performance.timing.loadEventEnd - performance.timing.navigationStart;

// backend
var backend = performance.timing.responseEnd - performance.timing.navigationStart;
var backendLeft = (backend / loaded)*100;

// first paint in chrome from https://github.com/addyosmani/timing.js
var hasFirstPaint = 0;
if (window.chrome && window.chrome.loadTimes) {
	var paint = window.chrome.loadTimes().firstPaintTime * 1000;
	var firstPaint = paint - (window.chrome.loadTimes().startLoadTime*1000);
	var firstPaintLeft = (firstPaint / loaded)*100;
	hasFirstPaint = 1;
}

// remove any exisiting "perfmap" divs on second click
var elements = document.getElementsByClassName("perfmap");
while(elements.length > 0){
    elements[0].parentNode.removeChild(elements[0]);
}

// build bottom legend
var perfmap = document.createElement("div");
perfmap.id = "perfmap";
var legend = "<div style='width:16.666666667%; height: 50px; float:left; background-color:#1a9850;'></div><div style='width:16.666666667%; height: 50px; float:left; background-color:#66bd63;'></div><div style='width:16.666666667%; height: 50px; float:left; background-color:#a6d96a;'></div><div style='width:16.666666667%; height: 50px; float:left; background-color:#fdae61;'></div><div style='width:16.666666667%; height: 50px; float:left; background-color:#f46d43;'></div><div style='width:16.666666667%; height: 50px; float:left; background-color:#d73027;'></div><div style='position:absolute; z-index:2; right:0px; padding-top:5px; padding-right:10px;height:100%;color:#fff;'>Fully Loaded " + parseInt(loaded) + "ms</div><div id='perfmap-timeline' style='position:absolute; z-index:4; left:-100px; border-left:2px solid white;height:100%;'></div>";
if(hasFirstPaint == 1){
	legend += "<div style='position:absolute; z-index:3; left:" + firstPaintLeft + "%; padding-top:5px; border-left:2px solid white;padding-left:5px;height:100%;color:#fff;'>First Paint " + parseInt(firstPaint) + "ms</div></div>";
}
perfmap.style.cssText = "position: fixed; width:100%; bottom:0; left:0; z-index:5000; height: 25px; color:#fff; font-family:\"Helvetica Neue\",sans-serif; font-size:14px; font-weight:800; line-height:14px;";
perfmap.innerHTML = legend;
document.body.appendChild(perfmap);

// build heatmap
findImages();

// remove loading message
loading.remove();

// mouse events to move timeline around on hover
var elements = document.getElementsByClassName("perfmap");
var timeline = document.getElementById('perfmap-timeline');
for ( var i=0, len = elements.length; i < len; i++ ) {
	elements[i].onmouseover = function(){
    	var timelineLeft = document.documentElement.clientWidth * (this.dataset.ms / loaded);
    	if(this.dataset.body != "1"){
			this.style.opacity = 1;
    	}
    	timeline.style.cssText = "opacity:1; transition: 0.5s ease-in-out; transform: translate("+ parseInt(timelineLeft) + "px,0); position:absolute; z-index:4; border-left:2px solid white; height:100%;";
    }
    elements[i].onmouseout = function(){		
    	var timelineLeft = document.documentElement.clientWidth * (this.dataset.ms / loaded);
    	if(this.dataset.body != "1"){
    		this.style.opacity = 0.925;
    	}
    	timeline.style.cssText = "opacity:0; transition: 0.5s ease-in-out; transform: translate("+ parseInt(timelineLeft) + "px,0); position:absolute; z-index:4; border-left:2px solid white; height:100%;";
    }
}
