(function () {
    'use strict';

    describe('directive: focus-model=""', function () {
        beforeEach(function () {
            bard.asyncModule('ngFastFocus', testHelpers.$timeoutReal);
            bard.inject(this, 'fastFocusFocuser', '$timeout');
        });

        it("should throw if the namesake attribute is not set to an expression", function () {
            return makeElement("<div focus-model></div>")
                .then(function () {
                    chai.assert.fail("expected error to be thrown");
                })
                .catch(function (error) {
                    expect(error.message).to.equal("focus-model directive requires namesake attribute to be set to expression to watch");
                });
        });

        it("should create a new focus group when linked and destroy the focus group when destroyed", function () {
            return makeElement()
                .then(function ($element) {
                    expect(fastFocusFocuser.getActiveFocusGroups()).to.deep.equal(['1']);

                    $element.scope().$destroy();

                    return $timeout();
                })
                .then(function () {
                    expect(fastFocusFocuser.getActiveFocusGroups()).to.deep.equal([]);
                });
        });

        it("should attempt to change the focus when linked", function () {
            fastFocusFocuser.changeFocusFor = sinon.spy();

            return makeElement()
                .then(function ($element) {
                    expect(fastFocusFocuser.changeFocusFor.called).to.be.true;
                });
        });

        it("should attempt to change the focus when the expression value changes", function () {
            fastFocusFocuser.changeFocusFor = sinon.spy();

            return makeElement()
                .then(function ($element) {
                    $element.scope().focusValue = 23;
                    $element.scope().$apply();
                    return $timeout();
                })
                .then(function () {
                    expect(fastFocusFocuser.changeFocusFor.called).to.be.true;
                });
        });

        function makeElement(html) {
            html = html || "<div focus-model='focusValue'></div>";
            return testHelpers.makeElement(html, {focusValue: 5});
        }
    });

})();
