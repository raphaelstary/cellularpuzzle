G.WorldView = (function (iterateEntries, RuleType, Constants, Font, wrap, Math) {
    "use strict";

    function WorldView(stage, hexViewHelper, nodes, edges) {
        this.stage = stage;
        this.hexViewHelper = hexViewHelper;
        this.nodes = nodes;
        this.edges = edges;
    }

    WorldView.prototype.init = function () {
        function radius(width) {
            return Math.floor(this.hexViewHelper.getWidth(width) / 5);
        }

        var drawables = {};
        iterateEntries(this.nodes, function (node, key) {
            drawables[key] = this.stage.createCircle(true)
                .setPosition(this.hexViewHelper.getXFn(node.x, node.y), this.hexViewHelper.getYFn(node.y))
                .setRadius(radius.bind(this))
                .setLineWidth(Font.get(Constants.DEFAULT_SCENE_HEIGHT, 4))
                .setColor(node.state == RuleType.ALIVE ? 'black' : 'white');
            drawables[key].data.lineColor = 'black';
        }, this);

        var edges = {};
        this.edges.forEach(function (pointPair) {
            var a = drawables[pointPair[0]];
            var b = drawables[pointPair[1]];
            edges[pointPair[0] + ':' + pointPair[1]] = this.stage.createABLine()
                .setA(wrap(a, 'x'), wrap(a, 'y'), [a])
                .setB(wrap(b, 'x'), wrap(b, 'y'), [b])
                .setLineWidth(Font.get(Constants.DEFAULT_SCENE_HEIGHT, 4))
                .setZIndex(2);
        }, this);
    };

    return WorldView;
})(H5.iterateEntries, G.RuleType, G.Constants, H5.Font, H5.wrap, Math);