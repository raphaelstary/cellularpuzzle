G.RulesOverlay = (function (MVVMScene, Constants, RuleShow, RuleEdit, Width, Height, Rule, RuleType, RuleOperator) {
    "use strict";

    /** @property addTxt */
    function RulesOverlay(services, animationView, rules, editable) {
        this.services = services;
        this.animationView = animationView;
        this.rules = rules;
        this.__editable = editable;

        this.__addedNewRule = false;
        this.__currentlyEditing = false;
    }

    /** @this RulesOverlay */
    RulesOverlay.prototype.postConstruct = function () {
        this.__currentlyEditing = false;
        var self = this;

        function setEditing(value) {
            self.__currentlyEditing = value;
        }

        function isEditing() {
            return self.__currentlyEditing;
        }

        function deleteRule(rule) {
            var ruleString = rule.toString();
            var foundIt = self.rules.some(function (elem, i, rules) {
                if (elem.toString() === ruleString) {
                    rules.splice(i, 1);
                    return true;
                }
                return false;
            });

            if (foundIt) {
                self.restartScene();
            }
        }

        function createRuleView(rule, index) {
            //noinspection JSPotentiallyInvalidUsageOfThis
            var activateEditMode = this.__addedNewRule && rule.toString() === this.__newRule;
            var ruleView = new RuleShow(this.services, this.animationView, rule, setEditing, isEditing, deleteRule, activateEditMode);

            var ruleSubScene = new MVVMScene(this.services, this.services.scenes[Constants.RULE_SHOW], ruleView, Constants.RULE_SHOW, Constants.DEFAULT_SCENE_RECT, Width.HALF, Height.get(
                8, index + 1));
            ruleSubScene.show();

            return ruleView;
        }

        this.ruleViews = this.rules.map(createRuleView, this);

        if (this.__addedNewRule) {
            this.__addedNewRule = false;
            this.__newRule = undefined;
        }

        if (this.__editable)
            this.__editable = this.rules.length < Constants.MAX_RULES;

        if (!this.__editable)
            this.addTxt.hide();
    };

    RulesOverlay.prototype.preDestroy = function () {
        this.ruleViews.forEach(function (view) {
            view.nextScene();
        })
    };

    //noinspection JSUnusedGlobalSymbols
    RulesOverlay.prototype.backDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    /** @this ViewModel */
    RulesOverlay.prototype.backUp = function () {
        if (this.__currentlyEditing)
            return;
        this.nextScene();
    };

    //noinspection JSUnusedGlobalSymbols
    RulesOverlay.prototype.addDown = function () {
    };

    //noinspection JSUnusedGlobalSymbols
    /** @this ViewModel */
    RulesOverlay.prototype.addUp = function () {
        if (this.__currentlyEditing)
            return;
        if (!this.__editable)
            return;

        var rule = new Rule(RuleType.DEAD, 3, RuleOperator.EQUAL_TO, true);
        this.rules.push(rule);

        this.__addedNewRule = true;
        this.__newRule = rule.toString();

        this.restartScene();
    };

    return RulesOverlay;
})(H5.MVVMScene, G.Constants, G.RuleShow, G.RuleEdit, H5.Width, H5.Height, G.Rule, G.RuleType, G.RuleOperator);