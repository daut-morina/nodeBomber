exports.index = function(req, res) {
    res.render('index', { title: 'nodeBomber' });
};

exports.playground = function(req, res) {
    res.render('playground', { title: 'nodeBomber Playground' });
};