G.PauseScreen = (function (PauseReturnValue) {
    "use strict";

    function PauseScreen(services) {
    }

    //noinspection JSUnusedGlobalSymbols
    PauseScreen.prototype.resumeDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    /** @this ViewModel */
    PauseScreen.prototype.resumeUp = function () {
        this.nextScene(PauseReturnValue.RESUME);
    };

    //noinspection JSUnusedGlobalSymbols
    PauseScreen.prototype.restartDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    /** @this ViewModel */
    PauseScreen.prototype.restartUp = function () {
        this.nextScene(PauseReturnValue.RESTART);
    };

    //noinspection JSUnusedGlobalSymbols
    PauseScreen.prototype.exitDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    /** @this ViewModel */
    PauseScreen.prototype.exitUp = function () {
        this.nextScene(PauseReturnValue.CANCEL);
    };

    return PauseScreen;
})(G.PauseReturnValue);