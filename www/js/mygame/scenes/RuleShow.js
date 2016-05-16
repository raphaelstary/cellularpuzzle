G.RuleShow = (function (Font, Constants, MVVMScene, RuleEdit, EditReturn) {
    "use strict";

    function RuleShow(services, rule, setEditing, isEditing, deleteRule, immediateEditing) {
        this.services = services;
        this.ruleData = rule;
        this.__setEditing = setEditing;
        this.__isEditing = isEditing;
        this.__deleteRule = deleteRule;
        this.__immediateEditing = immediateEditing;

        this.__init();
    }

    RuleShow.prototype.editDown = function () {
    };

    RuleShow.prototype.editUp = function () {
        if (!this.__editable)
            return;
        if (this.__isEditing())
            return;

        if (!this.__immediateEditing) {
            console.log('started manual editing id:' + this.ruleData.id);
        }

        var ruleEditScene = new MVVMScene(this.services, this.services.scenes[Constants.RULE_EDIT], new RuleEdit(this.services, this.ruleData), Constants.RULE_EDIT);
        this.__setEditing(true);
        var self = this;
        ruleEditScene.show(function (state) {
            if (state == EditReturn.SAVE) {
                self.__setRule(self.ruleData);
            } else if (state == EditReturn.DELETE) {
                self.__deleteRule(self.ruleData);
            } else if (state == EditReturn.ABORT && self.__immediateEditing) {
                self.__deleteRule(self.ruleData);
            }

            self.__setEditing(false);
        });
    };

    RuleShow.prototype.postConstruct = function () {
        this.__init();

        if (!this.ruleData.editable) {
            this.__editable = false;
            this.edit.hide();
        }

        this.__setRule(this.ruleData);

        if (this.__immediateEditing) {
            console.log('started immediate editing id:' + this.ruleData.id);
            this.editUp();
        }
    };

    RuleShow.prototype.__setRule = function (rule) {
        this.ruleOperator.setText(rule.operator);
        this.ruleValue.setText(rule.value);

        if (rule.type == 'dead') {
            this.currentState.setFilled(true);
            this.nextState.setFilled(false).setLineWidth(Font.get(Constants.DEFAULT_SCENE_HEIGHT, 2));
        } else {
            this.currentState.setFilled(false).setLineWidth(Font.get(Constants.DEFAULT_SCENE_HEIGHT, 2));
            this.nextState.setFilled(true);
        }
    };

    RuleShow.prototype.__init = function () {
        this.__editable = true;
    };

    return RuleShow;
})(H5.Font, G.Constants, H5.MVVMScene, G.RuleEdit, G.EditReturn);