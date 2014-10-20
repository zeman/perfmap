'use strict';
describe('getBgElement spec', function() {
    var dummyDOM = '<div>' +
        '<img src="http://somePath.com/jasmine.png" alt="some alt" width="160" height="160" class="someclass" title="abc" />' +
        '<img src="http://somePath.com/jasmine.jpg" alt="some alt" width="160" height="160" class="someclass" title="abc" />' +
        '<img src="http://somePath.com/jasmine.gif" alt="some alt" width="160" height="160" class="someclass" title="abc" />' +
        '<input type="hidden" value="0" data-next-step />' +
        '</div>';



    it("should return 1 element with same src url", function() {
        var div = document.createElement("div");
        div.style.width = "100px";
        div.style.height = "100px";
        div.style.background = "url(http://somePath.com/jasmine.jpg)";
        div.style.color = "white";
        div.innerHTML = "Hello";

        document.body.appendChild(div);

        var result = getBgElement(div);
        expect(result.element).toEqual(div);
        expect(result.src).toEqual(div.style.background);
    });

    it("should return null when has backgroung-image = none", function() {
        var div = document.createElement("div");
        div.style.width = "100px";
        div.style.height = "100px";
        div.style.background = "none";
        div.style.color = "white";
        div.innerHTML = "Hello";

        document.body.appendChild(div);

        var result = getBgElement(div);
        expect(result).toEqual(null);
    });
    it("should return null when has no backgroung", function() {
        var div = document.createElement("div");
        div.style.width = "100px";
        div.style.height = "100px";

        div.style.color = "white";
        div.innerHTML = "Hello";

        document.body.appendChild(div);

        var result = getBgElement(div);
        expect(result).toEqual(null);
    });

    it("should return null when has no backgroung", function() {
        var css = '.gb_Fa { background-image: url("https://somePath.com/i1_e9f91fe3.png"); background-size: 247px 204px;}',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);

        
        var div = document.createElement("div");
        div.className = "gb_Fa";


        document.body.appendChild(div);

        var result = getBgElement(div);
        expect(result.element).toEqual(div);
        expect(result.src).toEqual('url(https://somePath.com/i1_e9f91fe3.png)');
    });


});