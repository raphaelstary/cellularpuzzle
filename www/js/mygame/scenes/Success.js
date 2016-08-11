G.Success = (function () {
    "use strict";

    function Success(services) {
        this.timer = services.timer;
    }

    /** @this ViewModel */
    Success.prototype.postConstruct = function () {
        this.timer.doLater(this.nextScene.bind(this), 240);
    };

    return Success;
})();