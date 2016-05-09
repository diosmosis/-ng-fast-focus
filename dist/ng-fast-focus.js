(function () {
    'use strict';

    angular.module('ngFastFocus', [
        'ng'
    ]);

})();
(function () {
    'use strict';

    angular
        .module('ngFastFocus')
        .factory('fastFocusFocuser', fastFocusFocuser);

    fastFocusFocuser.$inject = [];

    /**
     * Intermediary service for the focus-model & focus-on directives.
     *
     * Tracks elements to focus by storing them in an object. Values to focus on are used as keys.
     *
     * Should never be necessary to access this service directly.
     */
    function fastFocusFocuser() {
        var focusGroups = {},
            currentFocusGroupId = 1;

        return {
            createFocusGroup: createFocusGroup,
            destroyFocusGroup: destroyFocusGroup,
            changeFocusFor: changeFocusFor,
            setFocusOn: setFocusOn,

            // mostly for tests
            getActiveFocusGroups: getActiveFocusGroups,
            getFocusGroup: getFocusGroup
        };

        function createFocusGroup() {
            var id = currentFocusGroupId;
            ++currentFocusGroupId;

            focusGroups[id] = {};

            return id.toString();
        }

        function destroyFocusGroup(groupId) {
            delete focusGroups[groupId];
        }

        function changeFocusFor(groupId, modelValue) {
            var focusGroup = focusGroups[groupId];
            if (!focusGroup) {
                return;
            }

            if (focusGroup.hasOwnProperty(modelValue)) {
                focusGroup[modelValue][0].focus();
            }
        }

        function setFocusOn(groupId, modelValue, $element) {
            if (!focusGroups[groupId]) {
                throw new Error("Unexpected state: no group '" + groupId + "'");
            }

            focusGroups[groupId][modelValue] = $element;
        }

        function getActiveFocusGroups() {
            return Object.keys(focusGroups);
        }

        function getFocusGroup(id) {
            return angular.copy(focusGroups[id]);
        }
    }

})();
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
