G.StartScreen = (function () {
    "use strict";

    function StartScreen(services) {
    }

    //noinspection JSUnusedGlobalSymbols
    /** @this ViewModel */
    StartScreen.prototype.startUp = function () {
        this.nextScene();
    };

    //noinspection JSUnusedGlobalSymbols
    StartScreen.prototype.startDown = function () {
    };

    return StartScreen;
})();