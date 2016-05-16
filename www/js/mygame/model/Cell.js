G.Cell = (function () {
    "use strict";

    function Cell(state, neighbors) {
        this.state = state;
        this.neighbors = neighbors;
    }

    return Cell;
})();