G.Rule = (function () {
    "use strict";

    function Rule(type, value, operator, editable) {
        this.type = type;
        this.value = value;
        this.operator = operator;
        this.editable = editable;
    }

    Rule.prototype.toString = function () {
        return this.type + this.operator + this.value;
    };

    return Rule;
})();