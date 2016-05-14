G.RulesOverlay = (function (MVVMScene, Constants, RuleShow, RuleEdit, Width, Height) {
    "use strict";

    function RulesOverlay(services) {
        this.services = services;
    }

    RulesOverlay.prototype.postConstruct = function () {
        var rules = [
            {
                type: 'dead',
                value: 3,
                operator: '=',
                editable: true
            }, {
                type: 'alive',
                value: 2,
                operator: '<',
                editable: true
            }
        ];

        function createRuleView(rule, index) {
            var ruleView = new RuleShow(this.services);
            ruleView.setRule(rule);

            var ruleSubScene = new MVVMScene(this.services, this.services.scenes[Constants.RULE_SHOW], ruleView, Constants.RULE_SHOW, Constants.DEFAULT_SCENE_RECT, Width.HALF, Height.get(
                8, index + 1));
            ruleSubScene.show();

            return ruleView;
        }

        this.ruleViews = rules.map(createRuleView, this);
    };

    RulesOverlay.prototype.preDestroy = function () {
        this.ruleViews.forEach(function (view) {
            view.nextScene();
        })
    };

    RulesOverlay.prototype.backDown = function () {

    };

    RulesOverlay.prototype.backUp = function () {
        this.nextScene();
    };

    RulesOverlay.prototype.addDown = function () {

    };

    RulesOverlay.prototype.addUp = function () {

    };

    return RulesOverlay;
})(H5.MVVMScene, G.Constants, G.RuleShow, G.RuleEdit, H5.Width, H5.Height);