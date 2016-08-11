G.Cell = (function () {
    "use strict";

    function Cell(state, drawable, neighbors) {
        this.state = state;
        this.drawable = drawable;
        this.neighbors = neighbors;
        this.isGoal = false;
    }

    return Cell;
})();