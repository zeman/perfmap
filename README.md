#PerfMap: front-end performance heatmap

A bookmarklet to create a front-end performance heatmap of resources loaded in the browser using the Resource Timing API.

Just add the bookmarklet below to your bookmarks bar.

```
javascript:(function(){var el=document.createElement('script');el.type='text/javascript';el.src='//zeman.github.io/perfmap/perfmap.js';document.getElementsByTagName('body')[0].appendChild(el);})();
```

The heatmap colours and the first ms value indicate at what point in the page load the image finished loading. It's a good indicator of user expereince... "It took 3450ms before the user saw this image." The second value in brackets is the time it took the browser to load that specific image.

##Example

![Example Heatmap](http://zeman.github.io/perfmap/example.jpg)

##Background

Conceived as part of a set of [data visualization experiments](http://lab.speedcurve.com) which re-imagined the front-end performance waterfall chart by Mark Zeman from [SpeedCurve](http://speedcurve.com) presented at [Velocity New York 2014.](http://speedcurve.com/blog/velocity-a-better-waterfall-chart/)

##Works In

Chrome

##To Do

- Deal with fixed position elements (calling all front-end ninjas, send me your thoughts on how best to do this)
- Try and identify background images
- Hover state with more detail on the timimgs of an individual resource
- Add strip across top of browser with page level timings and browser events
- User timing, pull out and highlight any elements with associated user timing events
- Expand top nav to show full waterfall chart of all resources. Combine with Andy's [waterfall bookmarklet?](https://github.com/andydavies/waterfall)

##Change Log

2014-10-06 First push of rough proof of concept

##Thanks

Big thanks to Steve Souders who was inspired enough to whip up the intial code structure while simultaneously participating at WebPerfDays NY. Clever cookie!