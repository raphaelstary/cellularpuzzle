G.Constants = (function () {
    "use strict";

    var GAME_KEY = 'cap-';
    var SCENE_WIDTH = 750;
    var SCENE_HEIGHT = 1334;

    return {
        // files
        SCENE_FILE: 'data/scenes.json',
        LEVELS_FILE: 'data/levels.json',
        FONT_FILE: 'data/webfont.woff',
        FONT_NAME: 'Calibri',

        // scenes
        START_SCREEN: 'start_screen',
        GAME_SCREEN: 'game_screen',
        PAUSE_SCREEN: 'pause_screen',
        RULES_OVERLAY: 'rules_overlay',
        RULE_SHOW: 'rule_show',
        RULE_EDIT: 'rule_edit',
        LEVEL_OVERVIEW: 'level_overview',

        // storage
        LEVEL_UNLOCKED: GAME_KEY + 'level_unlocked',
        LEVEL_UNLOCKING: GAME_KEY + 'level_unlocking',
        LEVEL_FINISHED: GAME_KEY + 'level_finished',
        LEVEL_FINISHED_NOW: GAME_KEY + 'level_finished_now',

        // magic numbers
        DEFAULT_SCENE_WIDTH: SCENE_WIDTH,
        DEFAULT_SCENE_HEIGHT: SCENE_HEIGHT,
        DEFAULT_SCENE_RECT: {
            width: SCENE_WIDTH,
            height: SCENE_HEIGHT
        },

        // defaults
        PRIMARY_FONT_COLOR: '#000000',
        SECONDARY_FONT_COLOR: '#ffffff',

        // game specific
        MAX_NEIGHBORS: 6,
        MIN_NEIGHBORS: 1,

        // gui specific
        MAX_RULES: 6
    };
})();