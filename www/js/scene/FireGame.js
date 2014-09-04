var FireGame = (function (calcScreenConst, changeCoords, changePath, changeTouchable, heightHalf, widthHalf, getTopRaster, WindowView, FireFighterView, Level, PeopleView, TimeView, PropertyManagement) {
    "use strict";

    function FireGame(stage, gameLoop, tapController, messages, sounds, resizeBus) {
        this.stage = stage;
        this.gameLoop = gameLoop;
        this.tapController = tapController;
        this.messages = messages;
        this.sounds = sounds;
        this.resizeBus = resizeBus;
    }

    var FONT_FACE = 'Arial';
    var FONT_COLOR = '#c4c4c4';

    FireGame.prototype.__setupDrawables = function () {
        var self = this;

        var backGroundDrawable = this.stage.drawFresh(widthHalf, heightHalf, 'scene', 0);

        function getTimeX() {
            return backGroundDrawable.getCornerX() + calcScreenConst(backGroundDrawable.getWidth(), 3);
        }
        var timeLeftDrawable = this.stage.drawText(getTimeX, getTopRaster, "2:00:00", 45, FONT_FACE, FONT_COLOR, 3, [backGroundDrawable]);


        function getPeopleLeftX() {
            return backGroundDrawable.getCornerX() + calcScreenConst(backGroundDrawable.getWidth(), 3, 2);
        }
        var peopleLeftDrawable = this.stage.drawText(getPeopleLeftX, getTopRaster, "10 left", 45, FONT_FACE, FONT_COLOR, 3, [backGroundDrawable]);


        var fireFighterDrawable = this.stage.drawFresh(widthHalf, function (height) {return calcScreenConst(height, 20, 19)}, 'firefighter', 3, [backGroundDrawable]);


        return {
            backGround: backGroundDrawable,
            timeLeft: timeLeftDrawable,
            peopleLeft: peopleLeftDrawable,
            fireFighter: fireFighterDrawable
        }
    };

    FireGame.prototype.show = function (nextScene) {
        var drawables = this.__setupDrawables();

        var firstLevelData = {
            time: 60*3,
            people: ['baby', 'baby', 'baby', 'granny', 'granny', 'granny', 'cat', 'cat', 'cat']
        };


        var firstLevel = new Level(firstLevelData, new TimeView(drawables.timeLeft), new PeopleView(drawables.peopleLeft),
            new FireFighterView(drawables.fireFighter, drawables.backGround, this.resizeBus.getWidth()),
            new PropertyManagement(new WindowView(this.stage, drawables.backGround)));

        this.resizeBus.add('level', firstLevel.resize.bind(firstLevel));
        this.gameLoop.add('level', firstLevel.tick.bind(firstLevel));

        firstLevel.start();

//        wView.createDrawableAtSpot1('baby_inside');
//        wView.createDrawableAtSpot2('cat_inside');
//        wView.createDrawableAtSpot3('cat_inside');
//        wView.createDrawableAtSpot4('cat_inside');
//        wView.createDrawableAtSpot5('cat_inside');
//        wView.createDrawableAtSpot6('cat_inside');
//        wView.createDrawableAtSpot7('cat_inside');
//        wView.createDrawableAtSpot8('cat_inside');
//        wView.createDrawableAtSpot9('cat_inside');
    };

    FireGame.prototype.next = function (nextScene) {

        nextScene();
    };

    return FireGame;
})(calcScreenConst, changeCoords, changePath, changeTouchable, heightHalf, widthHalf, getTopRaster, WindowView, FireFighterView, Level, PeopleView, TimeView, PropertyManagement);