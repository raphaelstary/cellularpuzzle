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
        changeSet.forEach(updateToNextState.bind(this));
        this.history.push(changeSet);
    };

    World.prototype.previousStep = function () {
        if (this.history.length < 1)
            return false;

        var changeSet = this.history.pop();
        changeSet.forEach(updateToPreviousState.bind(this));
        return true;
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

    function updateToNextState(change, index) {
        this.view.update(change.reference.drawable, change.nextState, index);
        change.reference.state = change.nextState;
    }

    function updateToPreviousState(change) {
        this.view.simpleUpdate(change.reference.drawable, change.previousState);
        change.reference.state = change.previousState;
    }

    function notUndefined(change) {
        return change;
    }

    return World;
})();