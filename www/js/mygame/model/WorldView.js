G.WorldView = (function (iterateEntries, RuleType, Constants, Font, wrap, Math, Transition, range) {
    "use strict";

    function WorldView(stage, timer, hexViewHelper, nodes, edges) {
        this.stage = stage;
        this.timer = timer;
        this.hexViewHelper = hexViewHelper;
        this.nodes = nodes;
        this.edges = edges;
        this.drawables = [];
    }

    var beatPattern = [
        {
            value: 1.2,
            duration: 4,
            easing: Transition.EASE_IN_SIN
        }, {
            value: 1,
            duration: 2,
            easing: Transition.EASE_OUT_SIN
        }, {
            value: 1.2,
            duration: 8,
            easing: Transition.EASE_IN_SIN
        }, {
            value: 1,
            duration: 10,
            easing: Transition.EASE_OUT_SIN
        }, {
            value: 1,
            duration: 120,
            easing: Transition.LINEAR
        }
    ];

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
                .setColor(isAlive(node.state) ? 'black' : 'white');
            drawable.data.lineColor = 'black';

            nodes[key] = drawable;

            if (isAlive(node.state))
                this.makeAlive(drawable);

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

    WorldView.prototype.makeAlive = function (drawable) {
        this.timer.doLater(function () {
            drawable.scalePattern(beatPattern, true);
        }, range(1, 15));
    };

    WorldView.prototype.simpleUpdate = function (drawable, state) {
        drawable.setColor(isAlive(state) ? 'black' : 'white');
    };

    WorldView.prototype.update = function (drawable, state, cellIndex) {
        drawable.pause();
        drawable.setColor(isAlive(state) ? 'black' : 'white');
        if (isAlive(state)) {
            this.timer.doLater(function () {
                drawable.scalePattern(beatPattern, true);
            }, range(cellIndex, cellIndex * 15));
        }
    };

    function isAlive(state) {
        return state == RuleType.ALIVE
    }

    return WorldView;
})(H5.iterateEntries, G.RuleType, G.Constants, H5.Font, H5.wrap, Math, H5.Transition, H5.range);