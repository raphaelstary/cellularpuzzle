G.RuleShow = (function (Font, Constants) {
    "use strict";

    function RuleShow() {
        this.__init();
    }

    RuleShow.prototype.editDown = function () {

    };

    RuleShow.prototype.editUp = function () {
        if (!this.__editable)
            return;

        // init remove
    };

    RuleShow.prototype.setRule = function (rule) {
        this.ruleData = rule;
    };

    RuleShow.prototype.postConstruct = function () {
        this.__init();

        if (!this.ruleData.editable) {
            this.__editable = false;
            this.edit.hide();
        }

        this.ruleOperator.setText(this.ruleData.operator);
        this.ruleValue.setText(this.ruleData.value);

        if (this.ruleData.type == 'dead') {
            this.currentState.setFilled(true);
            this.nextState.setFilled(false).setLineWidth(Font.get(Constants.DEFAULT_SCENE_HEIGHT, 2));
        }
    };

    RuleShow.prototype.__init = function () {
        this.__editable = true;
    };

    return RuleShow;
})(H5.Font, G.Constants);