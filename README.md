# ng-fast-focus

Efficient on-demand element focusing directive for angular.

## Description

This package provides two directives that can be used to set the current focus programatically in an
angular friendly way.

## Example

Use it as follows:

In your template:
```
<div ng-controller="MyController as myController" focus-model="currentlyFocusedIndex">
    <div ng-repeat="item in myController.items" focus-on="$index">
        <!-- ... -->
    </div>

    <button ng-click="myController.incrementFocus()">Cycle focus</button>
</div>
```

In your controller:
```
function MyController() {
    var vm = this;
    vm.items = ...;
    vm.currentlyFocusedIndex = null;
    vm.incrementFocus = incrementFocus;

    function incrementFocus() {
        vm.currentlyFocusedIndex = (vm.currentlyFocusedIndex + 1) % vm.items.length;
    }
}
```

The `focus-model` directive sets a watch on the given expression, while the `focus-on` directive associates the element it is used on with the value of the expression it's given.

When `focus-model`'s watch value changes, the element associated with the value is focused.

## Alternative Approaches

There two alternative approaches that I am aware of, both of which are slower than this one:

1. Creating a directive like `grab-focus="...boolean expression..."` which will set the focus to the element it's used on when the expression evaluates to true.

  This approach adds a watch for every element the directive is used on. Which means in a list of 100 items, 100 new watches will be created.

  Watches add to the time of every digest, so to me, this approach is unacceptable.

2. Creating a directive that listens for a scope event & focuses the element its used on, then broadcasting the event to the $rootScope.

  This approach involves broadcasting a scope event, which means it will traverse the entire scope hierarchy and no handler will be able to abort the event execution.

  Visiting every scope in the hierarchy just for changing the focus is also unacceptable to me.

In contrast to these two approaches, the ng-fast-focus module will only add one watch to every group of elements that must be focusable on demand.
