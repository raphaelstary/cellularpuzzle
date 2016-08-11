G.World = (function (RuleType) {
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

        var success = isSuccess(this.cells);

        if (!success) {
            this.cells.filter(isAlive).filter(isGoal).forEach(highlightRight.bind(this));
            this.cells.filter(isAlive).filter(isNotGoal).forEach(highlightWrong.bind(this));
            this.cells.filter(isDead).filter(isGoal).forEach(highlightGoal.bind(this));
        }

        return success;
    };

    World.prototype.previousStep = function () {
        if (this.history.length < 1)
            return false;

        var changeSet = this.history.pop();
        changeSet.forEach(updateToPreviousState.bind(this));

        this.cells.filter(isAlive).filter(isGoal).forEach(highlightRight.bind(this));
        this.cells.filter(isAlive).filter(isNotGoal).forEach(highlightWrong.bind(this));
        this.cells.filter(isDead).filter(isGoal).forEach(highlightGoal.bind(this));

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

    function updateToPreviousState(change, index) {
        this.view.update(change.reference.drawable, change.previousState, index);
        change.reference.state = change.previousState;
    }

    function highlightGoal(cell) {
        this.view.highlightGoalState(cell.drawable);
    }

    function highlightRight(cell) {
        this.view.highlightRightState(cell.drawable);
    }

    function highlightWrong(cell) {
        this.view.highlightWrongState(cell.drawable);
    }

    function isSuccess(cells) {
        return cells.filter(isAlive).every(isGoal);
    }

    function isAlive(cell) {
        return cell.state == RuleType.ALIVE;
    }

    function isDead(cell) {
        return cell.state == RuleType.DEAD;
    }

    function isGoal(cell) {
        return cell.isGoal;
    }

    function isNotGoal(cell) {
        return !cell.isGoal;
    }

    function notUndefined(change) {
        return change;
    }

    return World;
})(G.RuleType);