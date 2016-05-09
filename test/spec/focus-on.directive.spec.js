(function () {
    'use strict';

    describe('directive: focus-on=""', function () {
        var focusGroupId;

        beforeEach(function () {
            bard.asyncModule('ngFastFocus', testHelpers.$timeoutReal);
            bard.inject(this, 'fastFocusFocuser', '$timeout');

            focusGroupId = null;
        });

        it("should throw if focus-on attribute is not set", function () {
            return makeElement("<div focus-on></div>")
                .then(function () {
                    chai.assert.fail("expected error to be thrown");
                })
                .catch(function (error) {
                    expect(error.message).to.equal("focus-on directive requires namesake attribute to be set to expression");
                });
        });

        it("should throw if there is no parent element using the focus-model directive", function () {
            return makeElement("<div focus-on='1'></div>", {_focusGroupId: null})
                .then(function () {
                    chai.assert.fail("expected error to be thrown");
                })
                .catch(function (error) {
                    expect(error.message).to.equal("cannot find focus group in current or parent scopes");
                });
        });

        it("should throw if the expression value is invalid", function () {
            return makeElement("<div focus-on='garbagevariable.whatever'></div>")
                .then(function () {
                    chai.assert.fail("expected error to be thrown");
                })
                .catch(function (error) {
                    expect(error.message).to.equal("invalid focus-on expression or value 'garbagevariable.whatever'");
                });
        });

        it("should throw if the expression value is undefined", function () {
            return makeElement("<div focus-on='id'></div>", {id: undefined})
                .then(function () {
                    chai.assert.fail("expected error to be thrown");
                })
                .catch(function (error) {
                    expect(error.message).to.equal("invalid focus-on expression or value 'id'");
                });
        });

        it("should throw if the expression value is null", function () {
            return makeElement("<div focus-on='id'></div>", {id: null})
                .then(function () {
                    chai.assert.fail("expected error to be thrown");
                })
                .catch(function (error) {
                    expect(error.message).to.equal("invalid focus-on expression or value 'id'");
                });
        });

        it("should set the focus value for the element on the current focus group", function () {
            return makeElement("<div id='me' focus-on='id'></div>", {id: 23})
                .then(function () {
                    var group = fastFocusFocuser.getFocusGroup(focusGroupId);

                    expect(group).to.have.keys(['23']);
                    expect(group[23].attr('id')).to.be.equal('me');
                });
        });

        function makeElement(html, scopeVars) {
            scopeVars = scopeVars || {};

            if (!scopeVars.hasOwnProperty('_focusGroupId')) {
                focusGroupId = fastFocusFocuser.createFocusGroup();
                scopeVars._focusGroupId = focusGroupId;
            }

            return testHelpers.makeElement(html, scopeVars);
        }
    });

}());
