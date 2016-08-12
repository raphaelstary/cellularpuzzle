G.GameScreen = (function (MVVMScene, Constants, PauseScreen, PauseReturnValue, RulesOverlay, RuleEngine, HexViewHelper,
    WorldView, World, Width, Height, changeSign, Font, Rules, localStorage, loadBoolean, Success) {
    "use strict";

    /**
     * @property aliveRule
     * @property deadRule
     * @property aliveState
     * @property deadState
     */
    function GameScreen(services, level, levelNr) {
        this.stage = services.stage;
        this.timer = services.timer;
        this.device = services.device;
        this.events = services.events;

        this.level = level;
        this.levelNr = levelNr;
        this.services = services;

        this.__init();
    }

    GameScreen.prototype.__init = function () {
        this.__paused = false;
        this.__itIsOver = false;
    };

    /** @this GameScreen */
    GameScreen.prototype.__updateRuleSummary = function () {
        var aliveSummary = Rules.summarize(this.rules, Rules.isAlive);
        this.aliveRule.setText(aliveSummary.text);

        if (aliveSummary.number > 3) {
            this.aliveRule.setSize(Font.get(Constants.DEFAULT_SCENE_HEIGHT,
                40 - aliveSummary.number * (1.1 + aliveSummary.number * 0.25)));
        } else {
            this.aliveRule.setSize(Font.get(Constants.DEFAULT_SCENE_HEIGHT, 48));
        }

        var deadSummary = Rules.summarize(this.rules, Rules.isDead);
        this.deadRule.setText(deadSummary.text);

        if (deadSummary.number > 3) {
            this.deadRule.setSize(
                Font.get(Constants.DEFAULT_SCENE_HEIGHT, 40 - deadSummary.number * (1.1 + deadSummary.number * 0.25)));
        } else {
            this.deadRule.setSize(Font.get(Constants.DEFAULT_SCENE_HEIGHT, 48));
        }
    };

    /** @this GameScreen */
    GameScreen.prototype.postConstruct = function () {
        this.__init();

        // init level
        this.rules = this.level.rules.map(Rules.toRule);
        this.__updateRuleSummary();
        this.ruleEngine = new RuleEngine(this.rules);

        var offset = Height.get(10);
        var hexViewHelper = new HexViewHelper(this.stage, this.level.grid.xTiles, this.level.grid.yTiles, offset, offset, this.level.grid.adjustCenter);
        this.view = new WorldView(this.stage, this.timer, hexViewHelper, this.level.nodes, this.level.edges);

        var drawables = this.view.init();
        var cells = Rules.createCells(this.level.nodes, this.level.edges, drawables.nodes, this.level.goals);
        this.world = new World(this.ruleEngine.decideNextState.bind(this.ruleEngine), cells, this.view);

        this.timer.doLater(this.view.makeAlive.bind(this.view, this.aliveState), 45);

        var goalStates = this.level.goals.map(function (goal) {
            return drawables.nodes[goal];
        });

        this.view.highlightGoalStates(goalStates);
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
        var success = this.world.nextStep();

        if (success) {
            this.__itIsOver = true;
            this.timer.doLater(this.__success.bind(this), 120);
        }
    };

    /** @this ViewModel */
    GameScreen.prototype.__success = function () {
        this.events.fire(Event.ANALYTICS, {
            type: 'level_end',
            action: 'success',
            summary: 'missing',
            level: this.levelNr
        });

        var levelKey = this.levelNr < 10 ? '0' + this.levelNr : this.levelNr;
        var nextLevelNr = this.levelNr + 1;
        var nextLevelKey = nextLevelNr < 10 ? '0' + nextLevelNr : nextLevelNr;
        var isUnlocked = loadBoolean(Constants.LEVEL_UNLOCKED + nextLevelKey);
        var isFinished = loadBoolean(Constants.LEVEL_FINISHED + levelKey);

        if (!isUnlocked) {
            localStorage.setItem(Constants.LEVEL_UNLOCKED + nextLevelKey, true);
            localStorage.setItem(Constants.LEVEL_UNLOCKING + nextLevelKey, true);
        }
        if (!isFinished) {
            localStorage.setItem(Constants.LEVEL_FINISHED + levelKey, true);
            localStorage.setItem(Constants.LEVEL_FINISHED_NOW + levelKey, true);
        }

        var successScreen = new MVVMScene(this.services, this.services.scenes['success'], new Success(this.services), 'success');

        successScreen.show(this.nextScene.bind(this));
    };

    //noinspection JSUnusedGlobalSymbols
    GameScreen.prototype.rulesDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    GameScreen.prototype.rulesUp = function () {
        if (this.__paused || this.__itIsOver)
            return;

        var rulesView = new RulesOverlay(this.services, this.view, this.rules, this.level.grid.rulesEditable);
        var rulesOverlayScene = new MVVMScene(this.services, this.services.scenes[Constants.RULES_OVERLAY], rulesView, Constants.RULES_OVERLAY);
        this.__paused = true;
        var self = this;
        rulesOverlayScene.show(function () {
            self.__paused = false;
            self.ruleEngine.rules = self.rules = self.rules.filter(Rules.isAlive).sort(Rules.compare)
                .filter(Rules.notSame)
                .concat(self.rules.filter(Rules.isDead).sort(Rules.compare).filter(Rules.notSame));
            self.__updateRuleSummary();
        });
    };

    return GameScreen;
})(H5.MVVMScene, G.Constants, G.PauseScreen, G.PauseReturnValue, G.RulesOverlay, G.RuleEngine, H5.HexViewHelper,
    G.WorldView, G.World, H5.Width, H5.Height, H5.changeSign, H5.Font, G.Rules, H5.lclStorage, H5.loadBoolean,
    G.Success);