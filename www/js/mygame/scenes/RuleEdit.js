G.RuleEdit = (function (Font, EditReturn, Constants) {
    "use strict";

    function RuleEdit(services, rule) {
        this.ruleData = rule;
        this.rule = {
            type: rule.type,
            value: rule.value,
            operator: rule.operator,
            editable: rule.editable
        }
    }

    RuleEdit.prototype.swapDown = function () {
    };

    RuleEdit.prototype.swapUp = function () {
        if (this.rule.type == 'dead') {
            this.rule.type = 'alive';
            this.currentState.setFilled(false).setLineWidth(Font.get(Constants.DEFAULT_SCENE_HEIGHT, 2));
            this.nextState.setFilled(true);

        } else {
            this.rule.type = 'dead';
            this.currentState.setFilled(true);
            this.nextState.setFilled(false).setLineWidth(Font.get(Constants.DEFAULT_SCENE_HEIGHT, 2));
        }
    };

    RuleEdit.prototype.nextOpDown = function () {
    };

    RuleEdit.prototype.nextOpUp = function () {
        this.rule.operator = this.nextOp.data.msg;

        this.nextOp.setText(this.prevOp.data.msg);
        this.prevOp.setText(this.ruleOperator.data.msg);
        this.ruleOperator.setText(this.rule.operator);
    };

    RuleEdit.prototype.prevOpDown = function () {
    };

    RuleEdit.prototype.prevOpUp = function () {
        this.rule.operator = this.prevOp.data.msg;

        this.prevOp.setText(this.nextOp.data.msg);
        this.nextOp.setText(this.ruleOperator.data.msg);
        this.ruleOperator.setText(this.rule.operator);
    };

    RuleEdit.prototype.moreDown = function () {
    };

    RuleEdit.prototype.moreUp = function () {
        if (this.rule.value >= Constants.MAX_NEIGHBORS)
            return;

        this.ruleValue.setText(++this.rule.value);
    };

    RuleEdit.prototype.lessDown = function () {
    };

    RuleEdit.prototype.lessUp = function () {
        if (this.rule.value <= Constants.MIN_NEIGHBORS)
            return;

        this.ruleValue.setText(--this.rule.value);
    };

    RuleEdit.prototype.removeDown = function () {
    };

    RuleEdit.prototype.removeUp = function () {
        this.nextScene(EditReturn.DELETE);
    };

    RuleEdit.prototype.cancelDown = function () {
    };

    RuleEdit.prototype.cancelUp = function () {
        this.nextScene(EditReturn.ABORT);
    };

    RuleEdit.prototype.okDown = function () {
    };

    RuleEdit.prototype.okUp = function () {
        this.ruleData.type = this.rule.type;
        this.ruleData.value = this.rule.value;
        this.ruleData.operator = this.rule.operator;
        this.ruleData.editable = this.rule.editable;
        
        this.nextScene(EditReturn.SAVE);
    };

    RuleEdit.prototype.postConstruct = function () {
        this.ruleOperator.setText(this.ruleData.operator);

        if (this.ruleData.operator == '<') {
            this.nextOp.setText('>');
            this.prevOp.setText('=');
        } else if (this.ruleData.operator == '>') {
            this.nextOp.setText('=');
            this.prevOp.setText('<');
        }

        this.ruleValue.setText(this.ruleData.value);

        if (this.ruleData.type == 'dead') {
            this.currentState.setFilled(true);
            this.nextState.setFilled(false).setLineWidth(Font.get(Constants.DEFAULT_SCENE_HEIGHT, 2));
        }
    };

    return RuleEdit;
})(H5.Font, G.EditReturn, G.Constants);