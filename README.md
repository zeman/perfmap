#PerfMap: front-end performance heatmap

A bookmarklet to create a front-end performance heatmap of resources loaded in the browser using the Resource Timing API. A browser with [support for the Resource Timing API](http://caniuse.com/#feat=resource-timing) is required.

Just add the bookmarklet below to your bookmarks bar.

```javascript
javascript:(function(){var el=document.createElement('script');el.src='https://zeman.github.io/perfmap/perfmap.js';document.body.appendChild(el);})();
```
Wait for a page to fully load and then click the bookmarklet to overlay a performance heatmap.

The heatmap colours and the first ms value indicate at what point in the page load the image finished loading. It's a good indicator of user experience... "It took 3450ms before the user saw this image." The second value in brackets is the time it took the browser to load that specific image.

The legend attached to the bottom of the page shows timings for the full page load and hovering over a coloured area on the heatmap will move the timeline indicator to show you when that image was fully loaded.

##Example

![Example Heatmap](http://zeman.github.io/perfmap/example.jpg)

##Background

Conceived as part of a set of [data visualization experiments](http://lab.speedcurve.com) which re-imagined the front-end performance waterfall chart by Mark Zeman from [SpeedCurve](http://speedcurve.com) presented at [Velocity New York 2014.](http://speedcurve.com/blog/velocity-a-better-waterfall-chart/)

##Works In

Chrome

##To Do

- Deal with fixed position elements (calling all front-end ninjas, send me your thoughts on how best to do this)
- Crawl iframe images
- Hover state with more detail on the timings of an individual resource
- User timing, pull out and highlight any elements with associated user timing events
- Expand top nav to show full waterfall chart of all resources. Combine with Andy's [waterfall bookmarklet?](https://github.com/andydavies/waterfall)

##Change Log

- 2014-10-06 First push of rough proof of concept
- 2014-10-07 Added background-image support
- 2014-10-08 Added interactive legend with page level timing and timeline head on overlay hover
- 2014-10-12 Ignore elements with visibility:hidden, check for viewport sized images and treat like a body image, design tweaks

##Thanks

Big thanks to Steve Souders who was inspired enough to whip up the intial code structure while simultaneously participating at WebPerfDays NY. Clever cookie!
