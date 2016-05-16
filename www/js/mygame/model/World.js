G.World = (function () {
    "use strict";

    function World(decideNextState, cells, view) {
        this.__decideNextState = decideNextState;
        this.cells = cells;
        this.view = view;

        this.history = [];
    }

    World.prototype.nextStep = function () {
        var changeSet = this.cells.map(this.__calcNextState, this).filter(notUndefined);
        changeSet.forEach(updateToNextState);
        this.history.push(changeSet);
    };

    World.prototype.previousStep = function () {
        var changeSet = this.history.pop();
        changeSet.forEach(updateToPreviousState);
    };
    
    World.prototype.__calcNextState = function (cell) {
        var nextState = this.__decideNextState(cell);
        if (nextState != cell.state) {
            return {
                reference: cell,
                previousState: cell.state,
                nextState: nextState
            };
        }
    };
    
    function updateToNextState(change) {
        // todo update view
        change.reference.state = change.nextState;
    }

    function updateToPreviousState(change) {
        // todo update view
        change.reference.state = change.previousState;
    }

    function notUndefined(change) {
        return change;
    }
    return World;
})();