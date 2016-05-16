G.Rule = (function () {
    "use strict";

    function Rule(id, type, value, operator, editable) {
        this.id = id;
        this.type = type;
        this.value = value;
        this.operator = operator;
        this.editable = editable;
    }

    return Rule;
})();