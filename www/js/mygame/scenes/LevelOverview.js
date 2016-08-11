G.LevelOverview = (function (Width, Height, Event, Constants, Font, Math, MVVMScene, GameScreen, loadBoolean,
    localStorage, wrap, add) {
    "use strict";

    function LevelOverview(services) {
        this.stage = services.stage;
        this.tap = services.tap;
        this.sceneStorage = services.sceneStorage;
        this.events = services.events;
        this.buttons = services.buttons;
        this.messages = services.messages;
        this.device = services.device;
        this.sounds = services.sounds;
        this.timer = services.timer;
        this.levels = services.levels;
        this.scenes = services.scenes;

        this.services = services;
    }

    LevelOverview.prototype.preDestroy = function () {
        this.drawables.forEach(function (drawable) {
            drawable.remove();
        });
        this.taps.forEach(this.tap.remove.bind(this.tap));
    };

    LevelOverview.prototype.postConstruct = function () {
        var self = this;

        function createLevelDrawable(levelNr) {
            var levelKey = levelNr < 10 ? '0' + levelNr : levelNr;
            var isUnlocked = loadBoolean(Constants.LEVEL_UNLOCKED + levelKey);
            var isUnlocking = loadBoolean(Constants.LEVEL_UNLOCKING + levelKey);
            var isFinished = loadBoolean(Constants.LEVEL_FINISHED + levelKey);
            var isFinishedNow = loadBoolean(Constants.LEVEL_FINISHED_NOW + levelKey);
            if (levelNr === 1)
                isUnlocked = true;

            var positionX = ((levelNr - 1) % 4) + 1;
            var xFn = Width.get(5, positionX);
            var yFn = Height.get(6, Math.ceil(levelNr / 4));
            var levelIcon;

            function getInputCallback(isUnlocked, levelNr) {
                return function () {
                    if (isUnlocked) {
                        var resume = self.stopScene();

                        self.events.fire(Event.ANALYTICS, {
                            type: 'level_start',
                            level: levelNr
                        });

                        var game = new GameScreen(self.services, self.services.levels[levelNr], levelNr);
                        var gameScene = new MVVMScene(self.services, self.services.scenes[Constants.GAME_SCREEN], game, Constants.GAME_SCREEN);
                        self.sceneStorage.currentLevel = levelNr;
                        gameScene.show(resume);

                    } else {
                        // is locked
                    }
                };
            }

            function createCircle(filled) {
                return self.stage.createCircle(filled).setRadius(function (width, height) {
                    return Height.get(50)(height);
                })
            }

            function addLabel(levelIcon, unlocked) {
                if (unlocked) {
                    var numberLabel = self.stage.createText(levelNr.toString())
                        .setPosition(wrap(levelIcon, 'x'), add(wrap(levelIcon, 'y'), Height.get(25)), [levelIcon])
                        .setSize(Font._30)
                        .setFont(Constants.FONT_NAME).setZIndex(4).setAlpha(0.75);
                    self.drawables.push(numberLabel);
                }

                var touchable = self.stage.createRectangle()
                    .setPosition(wrap(levelIcon, 'x'), wrap(levelIcon, 'y'), [levelIcon]).setWidth(Width.get(5))
                    .setHeight(Height.get(6));

                touchable.hide();

                self.tap.add(touchable, getInputCallback(isUnlocked, levelNr));
                self.drawables.push(levelIcon);
                self.drawables.push(touchable);
                self.taps.push(touchable);
            }

            if (isUnlocking) {
                localStorage.setItem(Constants.LEVEL_UNLOCKING + levelKey, false);

                // unlock animation

                levelIcon = createCircle().setPosition(xFn, yFn);
                addLabel(levelIcon, isUnlocked);

            } else if (isUnlocked) {
                if (isFinishedNow) {
                    localStorage.setItem(Constants.LEVEL_FINISHED_NOW + levelKey, false);

                    // success animation
                    levelIcon = createCircle(true).setPosition(xFn, yFn);
                    addLabel(levelIcon, isUnlocked);

                } else if (isFinished) {
                    levelIcon = createCircle(true).setPosition(xFn, yFn);
                    addLabel(levelIcon, isUnlocked);

                } else {
                    // is unlocked
                    levelIcon = createCircle().setPosition(xFn, yFn);
                    addLabel(levelIcon, isUnlocked);
                }
            } else {
                // is locked
                levelIcon = createCircle().setPosition(xFn, yFn).setAlpha(0.25);
                addLabel(levelIcon, isUnlocked);
            }
        }

        this.taps = [];
        this.drawables = [];

        for (var i = 1; i <= 20; i++) {
            createLevelDrawable(i);
        }
    };

    //noinspection JSUnusedGlobalSymbols
    LevelOverview.prototype.backDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    /** @this ViewModel */
    LevelOverview.prototype.backUp = function () {
        this.nextScene();
    };

    return LevelOverview;
})(H5.Width, H5.Height, H5.Event, G.Constants, H5.Font, Math, H5.MVVMScene, G.GameScreen, H5.loadBoolean, H5.lclStorage,
    H5.wrap, H5.add);