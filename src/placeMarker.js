'use strict';

function placeMarker(xy, width, height, entry, body, url) {
    var heat = (entry.responseEnd / loaded),
        marker = document.createElement("div"),
        padding = 9,
        size = 18,
        paddingTop,
        opacity = 0.925,
        align = "center",
        bodyText = "";

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
        align = "right";
        paddingTop = 10;
        bodyText = "BODY ";
    }

    marker.className = "perfmap";
    marker.setAttribute("data-ms", parseInt(entry.responseEnd));
    marker.setAttribute("data-body", (body ? 1 : 0));
    marker.style.cssText = "position:absolute; transition: 0.5s ease-in-out; box-sizing: border-box; color: #fff; padding-left:10px; padding-right:10px; line-height:14px; font-size: " + size + "px; font-weight:800; font-family:\"Helvetica Neue\",sans-serif; text-align:" + align + "; opacity: " + opacity + "; background: " + heatmap(heat).value + "; top: " + xy.top + "px; left: " + xy.left + "px; width: " + width + "px; height:" + height + "px; padding-top:" + paddingTop + "px; z-index: 4000;";
    if (width > 50) {
        if (height > 15) {
            marker.innerHTML = bodyText + parseInt(entry.responseEnd) + "ms (" + parseInt(entry.duration) + "ms)";
        }
    }
    document.body.appendChild(marker);
}