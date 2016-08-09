G.GameScreen = (function (MVVMScene, Constants, PauseScreen, PauseReturnValue, RulesOverlay) {
    "use strict";

    function GameScreen(services, level) {
        this.stage = services.stage;

        this.level = level;
        this.services = services;

        this.__init();
    }

    GameScreen.prototype.__init = function () {
        this.__paused = false;
        this.__itIsOver = false;
    };

    GameScreen.prototype.postConstruct = function () {
        this.__init();

        // init level
    };

    GameScreen.prototype.preDestroy = function () {
        // clean up level stuff
    };

    //noinspection JSUnusedGlobalSymbols
    GameScreen.prototype.backDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    GameScreen.prototype.backUp = function () {
        if (this.__paused)
            return;
        if (this.__itIsOver)
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

    };

    //noinspection JSUnusedGlobalSymbols
    GameScreen.prototype.nextDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    GameScreen.prototype.nextUp = function () {

    };

    //noinspection JSUnusedGlobalSymbols
    GameScreen.prototype.rulesDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    GameScreen.prototype.rulesUp = function () {
        if (this.__paused)
            return;
        if (this.__itIsOver)
            return;

        var rules = [
            {
                id: 0,
                type: 'dead',
                value: 3,
                operator: '=',
                editable: true
            }, {
                id: 1,
                type: 'alive',
                value: 2,
                operator: '<',
                editable: true
            }
        ];
        var rulesView = new RulesOverlay(this.services, rules, true);
        var rulesOverlayScene = new MVVMScene(this.services, this.services.scenes[Constants.RULES_OVERLAY], rulesView, Constants.RULES_OVERLAY);
        this.__paused = true;
        var self = this;
        rulesOverlayScene.show(function () {
            self.__paused = false;
        });
    };

    return GameScreen;
})(H5.MVVMScene, G.Constants, G.PauseScreen, G.PauseReturnValue, G.RulesOverlay);