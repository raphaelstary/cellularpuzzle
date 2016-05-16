G.MyGameResources = (function (Constants, URL, addFontToDOM) {
    "use strict";

    // your files
    var scenes, levels;

    function registerFiles(resourceLoader) {
        // add your files to the resource loader for downloading
        scenes = resourceLoader.addJSON(Constants.SCENE_FILE);
        // font = resourceLoader.addFont(Constants.FONT_FILE);
        levels = resourceLoader.addJSON(Constants.LEVELS_FILE);

        return resourceLoader.getCount(); // number of registered files
    }

    function processFiles() {
        // process your downloaded files

        // if (URL) {
        //     addFontToDOM([
        //         {
        //             name: Constants.FONT_NAME,
        //             url: URL.createObjectURL(font.blob)
        //         }
        //     ]);
        // }
        return {
            // services created with downloaded files
            scenes: scenes,
            levels: levels
        };
    }

    return {
        create: registerFiles,
        process: processFiles
    };
})(G.Constants, window.URL || window.webkitURL, H5.addFontToDOM);