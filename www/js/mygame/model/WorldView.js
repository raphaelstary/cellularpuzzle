G.WorldView = (function (iterateEntries, RuleType, Constants, Font, wrap, Math) {
    "use strict";

    function WorldView(stage, hexViewHelper, nodes, edges) {
        this.stage = stage;
        this.hexViewHelper = hexViewHelper;
        this.nodes = nodes;
        this.edges = edges;
        this.drawables = [];
    }

    WorldView.prototype.init = function () {
        function radius(width) {
            return Math.floor(this.hexViewHelper.getWidth(width) / 5);
        }

        var nodes = {};
        iterateEntries(this.nodes, function (node, key) {
            var drawable = this.stage.createCircle(true)
                .setPosition(this.hexViewHelper.getXFn(node.x, node.y), this.hexViewHelper.getYFn(node.y))
                .setRadius(radius.bind(this))
                .setLineWidth(Font.get(Constants.DEFAULT_SCENE_HEIGHT, 4))
                .setColor(node.state == RuleType.ALIVE ? 'black' : 'white');
            nodes[key] = drawable;
            drawable.data.lineColor = 'black';
            this.drawables.push(drawable);
        }, this);

        var edges = {};
        this.edges.forEach(function (pointPair) {
            var a = nodes[pointPair[0]];
            var b = nodes[pointPair[1]];
            var drawable = this.stage.createABLine()
                .setA(wrap(a, 'x'), wrap(a, 'y'), [a])
                .setB(wrap(b, 'x'), wrap(b, 'y'), [b])
                .setLineWidth(Font.get(Constants.DEFAULT_SCENE_HEIGHT, 4))
                .setZIndex(2);
            edges[pointPair[0] + ':' + pointPair[1]] = drawable;
            this.drawables.push(drawable);
        }, this);

        return {
            nodes: nodes,
            edges: edges
        };
    };

    WorldView.prototype.preDestroy = function () {
        this.drawables.forEach(function (drawable) {
            drawable.remove();
        });
    };

    WorldView.prototype.update = function (drawable, state) {
        drawable.setColor(state == RuleType.ALIVE ? 'black' : 'white');
    };

    return WorldView;
})(H5.iterateEntries, G.RuleType, G.Constants, H5.Font, H5.wrap, Math);