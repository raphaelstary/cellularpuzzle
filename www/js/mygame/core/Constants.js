G.Constants = (function () {
    "use strict";

    var GAME_KEY = 'cap-';

    return {
        // files
        SCENE_FILE: 'data/scenes.json',
        FONT_FILE: 'data/webfont.woff',
        FONT_NAME: 'Calibri',

        // scenes
        START_SCREEN: 'start_screen',
        GAME_SCREEN: 'game_screen',
        PAUSE_SCREEN: 'pause_screen',
        RULES_OVERLAY: 'rules_overlay',
        RULE: 'rule',
        LEVEL_OVERVIEW: 'level_overview',

        // storage
        LEVEL_UNLOCKED: GAME_KEY + 'level_unlocked',
        LEVEL_UNLOCKING: GAME_KEY + 'level_unlocking',
        LEVEL_FINISHED: GAME_KEY + 'level_finished',
        LEVEL_FINISHED_NOW: GAME_KEY + 'level_finished_now',
        
        // magic numbers
        DEFAULT_SCENE_WIDTH: 750,
        DEFAULT_SCENE_HEIGHT: 1334,
        
        // defaults
        PRIMARY_FONT_COLOR: '#000000',
        SECONDARY_FONT_COLOR: '#ffffff'
    };
})();