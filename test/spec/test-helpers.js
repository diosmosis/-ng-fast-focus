(function () {
    window.testHelpers = {
        makeElement: makeElement,
        $timeoutReal: $timeoutReal
    };

    function makeElement(html, scopeVars) {
        var $compile, $rootScope, $timeout, $q;
        inject(function (_$compile_, _$rootScope_, _$timeout_, _$q_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;
            $q = _$q_;
        });

        scopeVars = scopeVars || {};

        var $scope = $rootScope.$new();
        Object.keys(scopeVars).forEach(function (key) {
			$scope[key] = scopeVars[key];
		});

        var $element;
        try {
            $element = $compile(html)($scope);
        } catch (error) {
            return $q.reject(error);
        }

        return waitUntilCompletelyCompiled($element, $scope);

        function waitUntilCompletelyCompiled($element, $scope) {
            $scope = $scope || $element.scope();

            var html = $element.html();

            $scope.$apply();

            var self = this;
            return $timeout(0, false).then(function () {
                if (html !== $element.html()) {
                    return waitUntilCompletelyCompiled($element, $scope);
                } else {
                    return $element;
                }
            });
        };
    }

    function $timeoutReal($provide) {
        $provide.provider('$timeout', function() {
            /*jshint validthis:true */
            this.$get = function() {
                return angular.injector(['ng']).get('$timeout');
            };
        });
    }
}());
