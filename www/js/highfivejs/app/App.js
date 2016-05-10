H5.App = (function ($) {
    "use strict";

    function App(services, myResources, installMyScenes, getStage, removeKeyHandler) {
        this.services = services;
        this.removeKeyHandler = removeKeyHandler;
        this.resources = myResources;
        this.installMyScenes = installMyScenes;
        // this.getLegacyStage = getLegacyStage;
        this.getStage = getStage;
    }

    App.prototype.start = function (gameInfo, callback) {

        // show loading screen, load binary resources
        var resourceLoader = new $.ResourceLoader();
        var initialScreen = new $.SimpleLoadingScreen(this.services.screen.getContext('2d'));

        var filesCount = this.resources.create(resourceLoader);
        var events = this.services.events;
        resourceLoader.onProgress = initialScreen.showProgress.bind(initialScreen);
        var initScreenId = events.subscribe($.Event.RESIZE, initialScreen.resize.bind(initialScreen));

        initialScreen.showNew(filesCount);

        var self = this;
        resourceLoader.onComplete = function () {
            events.unsubscribe(initScreenId);

            var sceneServices = self.resources.process();

            var stages = [];
            //if (self.getLegacyStage) {
            //    sceneServices.legacyStage = self.getLegacyStage(self.services.screen, sceneServices.gfxCache,
            //        self.services.device, events);
            //    if (sceneServices.legacyStage)
            //        stages.push(sceneServices.legacyStage);
            //}
            if (self.getStage) {
                sceneServices.stage = self.getStage(self.services.screen, sceneServices.gfxCache, self.services.device,
                    events);
                if (sceneServices.stage)
                    stages.unshift(sceneServices.stage);
            }
            sceneServices.loop = self.loop = $.installLoop(stages, events);

            var timer = new $.CallbackTimer();
            events.subscribe($.Event.TICK_START, timer.update.bind(timer));
            sceneServices.timer = timer;

            sceneServices.sceneStorage = {};
            sceneServices.sceneStorage.endCallback = function () {
                self.stop();
                if (self.removeKeyHandler)
                    self.removeKeyHandler();
                if (self.services.device.isFullScreen())
                    self.services.device.exitFullScreen();
                if (callback)
                    callback();
            };

            $.concatenateProperties(self.services, sceneServices);

            self.scenes = self.installMyScenes(sceneServices);
            self.__run();
        };

        resourceLoader.load();
    };

    App.prototype.__run = function () {
        this.scenes.next();
    };

    App.prototype.stop = function () {
        this.loop.stop();
    };

    return App;

})({
    ResourceLoader: H5.ResourceLoader,
    SimpleLoadingScreen: H5.SimpleLoadingScreen,
    installLoop: H5.installLoop,
    concatenateProperties: H5.concatenateProperties,
    CallbackTimer: H5.CallbackTimer,
    Event: H5.Event,
    window: window,
    MVVMScene: H5.MVVMScene,
    LoadingScreen: G.LoadingScreen,
    Constants: G.Constants,
    AtlasCache: H5.AtlasCache,
    getDevicePixelRatio: H5.getDevicePixelRatio,
    Math: Math,
    G: G
});