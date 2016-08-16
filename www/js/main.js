window.onload = function () {
    "use strict";

    var app = H5.Bootstrapper.pointer().responsive().fullScreen().build(G.MyGameResources, G.installMyScenes);
    app.start();
};