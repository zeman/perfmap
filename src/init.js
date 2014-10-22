'use strict';

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