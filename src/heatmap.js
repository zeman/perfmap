'use strict';

function heatmap(heat) {
    function findIndex(array, predicate) {
        var index = -1,
            length = array ? array.length : 0;
        while (++index < length) {
            if (predicate(array[index], index, array)) {
                return array[index];
            }
        }
        return array[length - 1];
    }

    return findIndex(hArr, function(chr) {
        return heat < chr.threashold;
    });
}