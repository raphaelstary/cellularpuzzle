G.RuleEdit = (function (Font, EditReturn, Constants, RuleType, RuleOperator) {
    "use strict";

    /**
     * @property currentState
     * @property nextState
     * @property nextOp
     * @property prevOp
     * @property ruleOperator
     * @property ruleValue
     */
    function RuleEdit(rule) {
        this.ruleData = rule;
        this.rule = {
            type: rule.type,
            value: rule.value,
            operator: rule.operator,
            editable: rule.editable
        }
    }

    //noinspection JSUnusedGlobalSymbols
    RuleEdit.prototype.swapDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    /** @this RuleEdit */
    RuleEdit.prototype.swapUp = function () {
        if (this.rule.type == RuleType.DEAD) {
            this.rule.type = RuleType.ALIVE;
            this.currentState.setFilled(false).setLineWidth(Font.get(Constants.DEFAULT_SCENE_HEIGHT, 2));
            this.nextState.setFilled(true);

        } else {
            this.rule.type = RuleType.DEAD;
            this.currentState.setFilled(true);
            this.nextState.setFilled(false).setLineWidth(Font.get(Constants.DEFAULT_SCENE_HEIGHT, 2));
        }
    };

    //noinspection JSUnusedGlobalSymbols
    RuleEdit.prototype.nextOpDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    /** @this RuleEdit */
    RuleEdit.prototype.nextOpUp = function () {
        this.rule.operator = this.nextOp.data.msg;

        this.nextOp.setText(this.prevOp.data.msg);
        this.prevOp.setText(this.ruleOperator.data.msg);
        this.ruleOperator.setText(this.rule.operator);
    };

    //noinspection JSUnusedGlobalSymbols
    RuleEdit.prototype.prevOpDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    /** @this RuleEdit */
    RuleEdit.prototype.prevOpUp = function () {
        this.rule.operator = this.prevOp.data.msg;

        this.prevOp.setText(this.nextOp.data.msg);
        this.nextOp.setText(this.ruleOperator.data.msg);
        this.ruleOperator.setText(this.rule.operator);
    };

    //noinspection JSUnusedGlobalSymbols
    RuleEdit.prototype.moreDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    /** @this RuleEdit */
    RuleEdit.prototype.moreUp = function () {
        if (this.rule.value >= Constants.MAX_NEIGHBORS)
            return;

        this.ruleValue.setText(++this.rule.value);
    };

    //noinspection JSUnusedGlobalSymbols
    RuleEdit.prototype.lessDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    /** @this RuleEdit */
    RuleEdit.prototype.lessUp = function () {
        if (this.rule.value <= Constants.MIN_NEIGHBORS)
            return;

        this.ruleValue.setText(--this.rule.value);
    };

    //noinspection JSUnusedGlobalSymbols
    RuleEdit.prototype.removeDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    /** @this ViewModel */
    RuleEdit.prototype.removeUp = function () {
        this.nextScene(EditReturn.DELETE);
    };

    //noinspection JSUnusedGlobalSymbols
    RuleEdit.prototype.cancelDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    /** @this ViewModel */
    RuleEdit.prototype.cancelUp = function () {
        this.nextScene(EditReturn.ABORT);
    };

    //noinspection JSUnusedGlobalSymbols
    RuleEdit.prototype.okDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    /** @this ViewModel */
    RuleEdit.prototype.okUp = function () {
        this.ruleData.type = this.rule.type;
        this.ruleData.value = this.rule.value;
        this.ruleData.operator = this.rule.operator;
        this.ruleData.editable = this.rule.editable;

        this.nextScene(EditReturn.SAVE);
    };

    /** @this RuleEdit */
    RuleEdit.prototype.postConstruct = function () {
        this.ruleOperator.setText(this.ruleData.operator);

        if (this.ruleData.operator == RuleOperator.LESS_THAN) {
            this.nextOp.setText(RuleOperator.GREATER_THAN);
            this.prevOp.setText(RuleOperator.EQUAL_TO);
        } else if (this.ruleData.operator == RuleOperator.GREATER_THAN) {
            this.nextOp.setText(RuleOperator.EQUAL_TO);
            this.prevOp.setText(RuleOperator.LESS_THAN);
        }

        this.ruleValue.setText(this.ruleData.value);

        if (this.ruleData.type == RuleType.DEAD) {
            this.currentState.setFilled(true);
            this.nextState.setFilled(false).setLineWidth(Font.get(Constants.DEFAULT_SCENE_HEIGHT, 2));
        }
    };

    return RuleEdit;
})(H5.Font, G.EditReturn, G.Constants, G.RuleType, G.RuleOperator);