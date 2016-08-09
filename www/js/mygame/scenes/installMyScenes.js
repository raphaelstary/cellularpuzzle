G.installMyScenes = (function (SceneManager, MVVMScene, Constants, StartScreen, LevelOverview, TapManager, Event) {
    "use strict";

    function installMyScenes(sceneServices) {
        // create your scenes and add them to the scene manager

        var tap = new TapManager();
        sceneServices.tap = tap;
        sceneServices.events.subscribe(Event.POINTER, tap.inputChanged.bind(tap));

        var sceneManager = new SceneManager();

        var startScreen = new MVVMScene(sceneServices, sceneServices.scenes[Constants.START_SCREEN], new StartScreen(sceneServices), Constants.START_SCREEN);
        var levelOverview = new MVVMScene(sceneServices, sceneServices.scenes[Constants.LEVEL_OVERVIEW], new LevelOverview(sceneServices), Constants.LEVEL_OVERVIEW);

        sceneManager.add(startScreen.show.bind(startScreen));
        sceneManager.add(levelOverview.show.bind(levelOverview));

        return sceneManager;
    }

    return installMyScenes;
})(H5.SceneManager, H5.MVVMScene, G.Constants, G.StartScreen, G.LevelOverview, H5.TapManager, H5.Event);