G.Rules = (function (Object, iterateEntries, RuleType, Rule, Cell) {
    "use strict";

    function toString(rule) {
        return rule.operator + rule.value;
    }

    function isAlive(rule) {
        return rule.type == RuleType.ALIVE;
    }

    function isDead(rule) {
        return rule.type == RuleType.DEAD;
    }

    function compare(ruleA, ruleB) {
        var returnValue = ruleA.value - ruleB.value;
        if (returnValue !== 0)
            return returnValue;

        if (ruleA.operator < ruleB.operator)
            return -1;
        if (ruleA.operator > ruleB.operator)
            return 1;
        return 0;
    }

    function notSame(rule, index, rules) {
        if (index === 0)
            return true;
        return compare(rules[index - 1], rule) !== 0;
    }

    function summarize(rules, hasType) {
        var filteredRules = rules.filter(hasType).sort(compare).filter(notSame);
        return {
            number: filteredRules.length,
            text: filteredRules.map(toString).join(',')
        }
    }

    function createCells(nodes, edges, nodeDrawables) {
        var cellDict = {};
        iterateEntries(nodes, function (node, key) {
            cellDict[key] = new Cell(node.state, nodeDrawables[key], []);
        });
        edges.forEach(function (edge) {
            var refA = edge[0];
            var refB = edge[1];
            var a = cellDict[refA];
            var b = cellDict[refB];
            a.neighbors.push(b);
            b.neighbors.push(a);
        });
        return Object.keys(cellDict).map(function (key) {
            return cellDict[key];
        })
    }

    function toRule(rule, i) {
        return new Rule(i, rule.type, rule.value, rule.operator, rule.editable)
    }

    return {
        toString: toString,
        isAlive: isAlive,
        isDead: isDead,
        compare: compare,
        notSame: notSame,
        summarize: summarize,
        createCells: createCells,
        toRule: toRule
    };
})(Object, H5.iterateEntries, G.RuleType, G.Rule, G.Cell);