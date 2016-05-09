(function () {
    'use strict';

    angular
        .module('ngFastFocus')
        .directive('focusOn', focusOn);

    focusOn.$inject = ['fastFocusFocuser'];

    /**
     * This directive should be used on child elements of an element that uses the
     * focus-model directive.
     *
     * It marks elements so they will be focused when the focus model variable changes
     * to a certain value.
     *
     * The value is determined by the expression supplied to the focus-on=""
     * attribute.
     */
    function focusOn(fastFocusFocuser) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {
                var focusOnExpr = $attr.focusOn;
                if (!focusOnExpr) {
                    throw new Error("focus-on directive requires namesake attribute to be set to expression");
                }

                var currentFocusGroupId = findCurrentFocusGroup();
                if (!currentFocusGroupId) {
                    throw new Error("cannot find focus group in current or parent scopes");
                }

                var focusOnValue = $scope.$eval(focusOnExpr);
                if (focusOnValue === undefined || focusOnValue === null) {
                    throw new Error("invalid focus-on expression or value '" + focusOnExpr + "'");
                }

                fastFocusFocuser.setFocusOn(currentFocusGroupId, focusOnValue, $element);

                function findCurrentFocusGroup() {
                    var currentScope = $scope;
                    do {
                        if (currentScope._focusGroupId) {
                            return currentScope._focusGroupId;
                        }

                        currentScope = currentScope.$parent;
                    } while (currentScope);

                    return null;
                }
            }
        };
    }

})();
