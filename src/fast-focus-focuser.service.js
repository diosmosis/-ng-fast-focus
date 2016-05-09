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
