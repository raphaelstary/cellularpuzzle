G.installMyScenes = (function (Scenes, MVVMScene, Constants, StartScreen, LevelOverview, Taps, Event, GoFullScreen) {
    "use strict";

    function installMyScenes(sceneServices) {
        // create your scenes and add them to the scene manager

        var tap = new Taps();
        sceneServices.tap = tap;
        sceneServices.events.subscribe(Event.POINTER, tap.inputChanged.bind(tap));

        var scenes = new Scenes();

        var goFullScreen = new GoFullScreen(sceneServices);

        var startScreen = new MVVMScene(sceneServices, sceneServices.scenes[Constants.START_SCREEN], new StartScreen(sceneServices), Constants.START_SCREEN);
        var levelOverview = new MVVMScene(sceneServices, sceneServices.scenes[Constants.LEVEL_OVERVIEW], new LevelOverview(sceneServices), Constants.LEVEL_OVERVIEW);

        scenes.add(goFullScreen.show.bind(goFullScreen));
        scenes.add(startScreen.show.bind(startScreen));
        scenes.add(levelOverview.show.bind(levelOverview));

        return scenes;
    }

    return installMyScenes;
})(H5.Scenes, H5.MVVMScene, G.Constants, G.StartScreen, G.LevelOverview, H5.Taps, H5.Event, G.GoFullScreen);