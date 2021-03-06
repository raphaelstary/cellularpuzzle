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

    function radius(width, height) {
        return Math.floor(this.hexViewHelper.getWidth(width, height) / 5);
    }

    WorldView.prototype.init = function () {

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

    WorldView.prototype.__createCircle = function (drawable, color) {
        return this.stage.createCircle()
            .setPosition(wrap(drawable, 'x'), wrap(drawable, 'y'), [drawable])
            .setRadius(radius.bind(this))
            .setColor(color)
            .setZIndex(2)
            .setLineWidth(Font.get(Constants.DEFAULT_SCENE_HEIGHT, 3));
    };

    var SCALE_MAX = 2;
    var DURATION = 30;

    WorldView.prototype.__scale = function (drawable, callback) {
        drawable.scaleTo(SCALE_MAX).setDuration(DURATION).setCallback(function () {
            drawable.remove();
            if (callback)
                callback();
        });
    };
    WorldView.prototype.__highlight = function (color, drawable) {
        var one = this.__createCircle(drawable, color);
        var two = this.__createCircle(drawable, color);
        var three = this.__createCircle(drawable, color);
        var four = this.__createCircle(drawable, color);
        var five = this.__createCircle(drawable, color);
        var six = this.__createCircle(drawable, color);

        var promise = {
            isOver: false,
            callback: undefined
        };

        function callback() {
            promise.isOver = true;
            if (promise.callback)
                promise.callback();
        }

        this.__scale(one);
        this.timer.doLater(this.__scale.bind(undefined, two), 5);
        this.timer.doLater(this.__scale.bind(undefined, three), 10);
        this.timer.doLater(this.__scale.bind(undefined, four), 60);
        this.timer.doLater(this.__scale.bind(undefined, five), 65);
        this.timer.doLater(this.__scale.bind(undefined, six, callback), 70);

        return promise;
    };

    WorldView.prototype.highlightGoalStates = function (drawables) {
        return drawables.map(this.__highlight.bind(this, 'black'));
    };

    WorldView.prototype.highlightGoalState = function (drawable) {
        return this.__highlight('black', drawable);
    };

    WorldView.prototype.highlightRightState = function (drawable) {
        return this.__highlight('green', drawable);
    };

    WorldView.prototype.highlightWrongState = function (drawable) {
        return this.__highlight('red', drawable);
    };

    WorldView.prototype.preDestroy = function () {
        this.drawables.forEach(function (drawable) {
            drawable.remove();
        });
    };

    WorldView.prototype.makeAlive = function (drawable) {
        drawable.pendingState = RuleType.ALIVE;
        this.timer.doLater(function () {
            if (drawable.pendingState != RuleType.ALIVE)
                return;
            delete drawable.pendingState;
            drawable.scalePattern(beatPattern, true);
        }, range(1, 15));
    };

    WorldView.prototype.stopAlive = function (drawable) {
        drawable.pause();
        delete drawable.pendingState;
    };

    WorldView.prototype.update = function (drawable, state, cellIndex) {
        drawable.pause();
        drawable.setScale(1);
        drawable.setColor(isAlive(state) ? 'black' : 'white');

        if (isAlive(state)) {
            drawable.pendingState = RuleType.ALIVE;
            this.timer.doLater(function () {
                if (drawable.pendingState != RuleType.ALIVE)
                    return;
                delete drawable.pendingState;
                drawable.scalePattern(beatPattern, true);
            }, range(cellIndex, cellIndex * 15));
        } else {
            delete drawable.pendingState;
        }
    };

    function isAlive(state) {
        return state == RuleType.ALIVE
    }

    return WorldView;
})(H5.iterateEntries, G.RuleType, G.Constants, H5.Font, H5.wrap, Math, H5.Transition, H5.range);