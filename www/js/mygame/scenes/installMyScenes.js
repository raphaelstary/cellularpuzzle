G.installMyScenes = (function (SceneManager, MVVMScene, Constants, StartScreen, LevelOverview) {
    "use strict";

    function installMyScenes(sceneServices) {
        // create your scenes and add them to the scene manager

        var sceneManager = new SceneManager();

        var startScreen = new MVVMScene(sceneServices, sceneServices.scenes[Constants.START_SCREEN],
            new StartScreen(sceneServices), Constants.START_SCREEN);
        var levelOverview = new LevelOverview(sceneServices);
        
        sceneManager.add(startScreen.show.bind(startScreen));
        sceneManager.add(levelOverview.show.bind(levelOverview));

        return sceneManager;
    }

    return installMyScenes;
})(H5.SceneManager, H5.MVVMScene, G.Constants, G.StartScreen, G.LevelOverview);