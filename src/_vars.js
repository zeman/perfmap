var perfMap = {},
    loading,
    loaded,
    gZeroLeft = 0,
    gZeroTop = 0,
    hArr = [{
        threashold: 0.16,
        value: '#1a9850',
        rgba: 'rgba(26, 152, 80, 0.95)'
    }, {
        threashold: 0.32,
        value: '#66bd63',
        rgba: 'rgba(102, 189, 99, 0.95)'
    }, {
        threashold: 0.48,
        value: '#a6d964',
        rgba: 'rgba(166, 217, 100, 0.95)'
    }, {
        threashold: 0.64,
        value: '#fdae61',
        rgba: 'rgba(253, 174, 97, 0.95)'
    }, {
        threashold: 0.8,
        value: '#f46d43',
        rgba: 'rgba(244, 109, 67, 0.95)'
    }, {
        threashold: 1.1,
        value: '#d73027',
        rgba: 'rgba(215, 48, 39, 0.95)'
    }];