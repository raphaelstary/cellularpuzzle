G.GameScreen = (function (MVVMScene, Constants, PauseScreen, PauseReturnValue, RulesOverlay, Rule, RuleType,
    RuleOperator, RuleEngine, HexViewHelper, zero, WorldView, World, Width, Height, changeSign, Cell, iterateEntries) {
    "use strict";

    /**
     * @property aliveRule
     * @property deadRule
     */
    function GameScreen(services, level) {
        this.stage = services.stage;
        this.device = services.device;

        this.level = level;
        this.services = services;

        this.__init();
    }

    GameScreen.prototype.__init = function () {
        this.__paused = false;
        this.__itIsOver = false;
    };

    function toRule(rule, i) {
        return new Rule(i, rule.type, rule.value, rule.operator, rule.editable)
    }

    function toString(rule) {
        return rule.operator + rule.value;
    }

    function isAlive(rule) {
        return rule.type == RuleType.ALIVE;
    }

    function isDead(rule) {
        return rule.type == RuleType.DEAD;
    }

    function compare(ruleA, ruleB) {
        var returnValue = ruleA.value - ruleB.value;
        if (returnValue !== 0)
            return returnValue;

        if (ruleA.operator < ruleB.operator)
            return -1;
        if (ruleA.operator > ruleB.operator)
            return 1;
        return 0;
    }

    function notSame(rule, index, rules) {
        if (index === 0)
            return true;
        return compare(rules[index - 1], rule) !== 0;
    }

    function summarize(rules, hasType) {
        return rules.filter(hasType).sort(compare).filter(notSame).map(toString).join(',');
    }

    function createCells(nodes, edges, nodeDrawables) {
        var cellDict = {};
        iterateEntries(nodes, function (node, key) {
            cellDict[key] = new Cell(node.state, nodeDrawables[key], []);
        });
        edges.forEach(function (edge) {
            var refA = edge[0];
            var refB = edge[1];
            var a = cellDict[refA];
            var b = cellDict[refB];
            a.neighbors.push(b);
            b.neighbors.push(a);
        });
        return Object.keys(cellDict).map(function (key) {
            return cellDict[key];
        })
    }

    /** @this GameScreen */
    GameScreen.prototype.__updateRuleSummary = function () {
        this.aliveRule.setText(summarize(this.rules, isAlive));
        this.deadRule.setText(summarize(this.rules, isDead));
    };

    GameScreen.prototype.postConstruct = function () {
        this.__init();

        // init level
        this.rules = this.level.rules.map(toRule);
        this.__updateRuleSummary();
        var ruleEngine = new RuleEngine(this.rules);

        var hexViewHelper = new HexViewHelper(this.stage, 3, 3, changeSign(Width.get(6)), Height.get(5));
        this.view = new WorldView(this.stage, hexViewHelper, this.level.nodes, this.level.edges);

        var drawables = this.view.init();
        var cells = createCells(this.level.nodes, this.level.edges, drawables.nodes);
        this.world = new World(ruleEngine.decideNextState.bind(ruleEngine), cells, this.view);
    };

    GameScreen.prototype.preDestroy = function () {
        // clean up level stuff
        this.view.preDestroy();
    };

    //noinspection JSUnusedGlobalSymbols
    GameScreen.prototype.backDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    GameScreen.prototype.backUp = function () {
        if (this.__paused || this.__itIsOver)
            return;

        var pauseScene = new MVVMScene(this.services, this.services.scenes[Constants.PAUSE_SCREEN], new PauseScreen(this.services), Constants.PAUSE_SCREEN);
        this.__paused = true;
        var self = this;
        pauseScene.show(function (state) {
            if (state == PauseReturnValue.RESUME) {
                self.__paused = false;
            } else if (state == PauseReturnValue.RESTART) {
                self.restartScene();
            } else if (state == PauseReturnValue.CANCEL) {
                self.__itIsOver = true;
                self.nextScene();
            } else {
                throw 'internal error: unhandled code branch';
            }
        });
    };

    //noinspection JSUnusedGlobalSymbols
    GameScreen.prototype.undoDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    GameScreen.prototype.undoUp = function () {
        if (this.__paused || this.__itIsOver)
            return;
        this.world.previousStep();
    };

    //noinspection JSUnusedGlobalSymbols
    GameScreen.prototype.nextDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    GameScreen.prototype.nextUp = function () {
        if (this.__paused || this.__itIsOver)
            return;
        this.world.nextStep();
    };

    //noinspection JSUnusedGlobalSymbols
    GameScreen.prototype.rulesDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    GameScreen.prototype.rulesUp = function () {
        if (this.__paused || this.__itIsOver)
            return;

        var rulesView = new RulesOverlay(this.services, this.rules, true);
        var rulesOverlayScene = new MVVMScene(this.services, this.services.scenes[Constants.RULES_OVERLAY], rulesView, Constants.RULES_OVERLAY);
        this.__paused = true;
        var self = this;
        rulesOverlayScene.show(function () {
            self.__paused = false;
            self.__updateRuleSummary();
        });
    };

    return GameScreen;
})(H5.MVVMScene, G.Constants, G.PauseScreen, G.PauseReturnValue, G.RulesOverlay, G.Rule, G.RuleType, G.RuleOperator,
    G.RuleEngine, H5.HexViewHelper, H5.zero, G.WorldView, G.World, H5.Width, H5.Height, H5.changeSign, G.Cell,
    H5.iterateEntries);