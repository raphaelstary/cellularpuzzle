G.RuleEngine = (function (RuleOperator, RuleType) {
    "use strict";

    function RuleEngine(rules) {
        this.rules = rules;
    }

    RuleEngine.prototype.decideNextState = function (cell) {
        var nextState = cell.state;

        var neighborCount = cell.neighbors.reduce(getNeighborsCount, 0);

        this.rules.some(function (rule) {
            if (cell.state == rule.type)
                return false;

            if (!isMatch(rule, neighborCount))
                return false;

            nextState = rule.type;
            return true;
        });

        return nextState;
    };

    function getNeighborsCount(currentCount, neighbor) {
        return neighbor.state == RuleType.ALIVE ? currentCount + 1 : currentCount;
    }

    function isMatch(rule, neighborCount) {
        return isLess(rule, neighborCount) || isEqual(rule, neighborCount) || isGreater(rule, neighborCount);
    }

    function isLess(rule, neighborCount) {
        return rule.operator == RuleOperator.LESS_THAN && neighborCount < rule.value;
    }

    function isEqual(rule, neighborCount) {
        return rule.operator == RuleOperator.EQUAL_TO && neighborCount == rule.value;
    }

    function isGreater(rule, neighborCount) {
        return rule.operator == RuleOperator.GREATER_THAN && neighborCount > rule.value;
    }

    return RuleEngine;
})(G.RuleOperator, G.RuleType);