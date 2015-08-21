var installLoop = (function (GameLoop, Event) {
    "use strict";

    function installLoop(stages, events) {

        var gameLoop = new GameLoop(events);
        stages.forEach(function (stage) {
            events.subscribe(Event.TICK_CAMERA, stage.clear.bind(stage));
            events.subscribe(Event.TICK_DRAW, stage.update.bind(stage));
        });
        events.subscribe(Event.TICK_START, events.updateDeletes.bind(events));

        gameLoop.run();

        return gameLoop;
    }

    return installLoop;
})(GameLoop, Event);