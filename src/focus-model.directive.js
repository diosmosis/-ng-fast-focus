(function () {
    'use strict';

    angular
        .module('ngFastFocus')
        .directive('focusModel', focusModel);

    focusModel.$inject = ['fastFocusFocuser'];

    /**
     * This directive watches an expression and changes the focus when the expression
     * value changes.
     *
     * Use this directive on a containing element. Then use the focus-on directive
     * on child elements to mark what values should trigger a focus change to those
     * elements.
     */
    function focusModel(fastFocusFocuser) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {
                var focusExpr = $attr.focusModel;
                if (!focusExpr) {
                    throw new Error("focus-model directive requires namesake attribute to be set to expression to watch");
                }

                var focusGroupId = fastFocusFocuser.createFocusGroup();
                $scope._focusGroupId = focusGroupId;

                $scope.$watch(focusExpr, function (newValue, oldValue) {
                    fastFocusFocuser.changeFocusFor(focusGroupId, newValue);
                });

                $scope.$on('$destroy', function () {
                    fastFocusFocuser.destroyFocusGroup(focusGroupId);
                });
            }
        };
    }

})();
