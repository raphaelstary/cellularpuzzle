G.GameScreen = (function (MVVMScene, Constants, PauseScreen, PauseReturnValue) {
    "use strict";

    function GameScreen(services) {
        this.stage = services.stage;

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

    GameScreen.prototype.backDown = function () {
    };

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
        })
    };

    GameScreen.prototype.undoDown = function () {

    };

    GameScreen.prototype.undoUp = function () {

    };

    GameScreen.prototype.nextDown = function () {

    };

    GameScreen.prototype.nextUp = function () {

    };

    GameScreen.prototype.rulesDown = function () {

    };

    GameScreen.prototype.rulesUp = function () {

    };

    return GameScreen;
})(H5.MVVMScene, G.Constants, G.PauseScreen, G.PauseReturnValue);