'use strict';

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