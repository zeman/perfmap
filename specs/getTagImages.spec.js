'use strict';
describe('getTagImages spec', function() {
    var container = document.createElement("div");
    container.id = 'container';
    document.body.appendChild(container);

    beforeEach(function() {
        document.getElementById('container');
        container.innerHTML = '';
    });
    
    it("should return 3 images", function() {
        container.innerHTML = '<div>' +
            '<img src="http://somePath.com/jasmine.png" alt="some alt" width="160" height="160" class="someclass" title="abc" />' +
            '<img src="http://somePath.com/jasmine.jpg" alt="some alt" width="160" height="160" class="someclass" title="abc" />' +
            '<img src="http://somePath.com/jasmine.gif" alt="some alt" width="160" height="160" class="someclass" title="abc" />' +
            '<input type="hidden" value="0" data-next-step />' +
            '</div>';
        var result = getTagImages(document);
        expect(result.length).toEqual(3);
    });

    it("should return 0 images", function() {
        var div = document.createElement("div");
        container.appendChild(div);
        var result = getTagImages(document);
        expect(result).toEqual([]);
    });

    it("should return 3 images with different extensions", function() {
        container.innerHTML = '<div>' +
            '<img src="http://somePath.com/jasmine.png" alt="some alt" width="160" height="160" class="someclass" title="abc" />' +
            '<img src="http://somePath.com/jasmine.jpg" alt="some alt" width="160" height="160" class="someclass" title="abc" />' +
            '<img src="http://somePath.com/jasmine.gif" alt="some alt" width="160" height="160" class="someclass" title="abc" />' +
            '<input type="hidden" value="0" data-next-step />' +
            '</div>';
        var result = getTagImages(document);
        expect(result[0].src).toEqual("http://somePath.com/jasmine.png");
        expect(result[1].src).toEqual("http://somePath.com/jasmine.jpg");
        expect(result[2].src).toEqual("http://somePath.com/jasmine.gif");
    });

    it("should return 0 images when it has no src attribute ", function() {
        container.innerHTML = '<div>' +
            '<img alt="some alt" width="160" height="160" class="someclass" title="abc" />' +
            '<input type="hidden" value="0" data-next-step />' +
            '</div>';
        var result = getTagImages(document);
        expect(result.length).toEqual(0);
    });



});