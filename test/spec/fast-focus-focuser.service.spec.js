(function () {
    'use strict';

    describe("service: fastFocusFocuser", function () {
        beforeEach(function () {
            bard.asyncModule('ngFastFocus', testHelpers.$timeoutReal);
            bard.inject(this, 'fastFocusFocuser');
        });

        describe("#createFocusGroup()", function () {
            it("should create a new focus group with a new truthy ID when called", function () {
                var createdId = fastFocusFocuser.createFocusGroup();

                expect(createdId).to.be.truthy;
                expect(fastFocusFocuser.getActiveFocusGroups()).to.deep.equal([createdId]);
            });
        });

        describe("#destroyFocusGroup()", function () {
            var focusGroupId;
            beforeEach(function () {
                focusGroupId = fastFocusFocuser.createFocusGroup();

                expect(fastFocusFocuser.getActiveFocusGroups()).to.deep.equal([focusGroupId]);
            });

            it("should remove a focus group by ID when called", function () {
                fastFocusFocuser.destroyFocusGroup(focusGroupId);

                expect(fastFocusFocuser.getActiveFocusGroups()).to.be.empty;
            });

            it("should do nothing when called with an unrecognized ID", function () {
                fastFocusFocuser.destroyFocusGroup('garbage value');

                expect(fastFocusFocuser.getActiveFocusGroups()).to.deep.equal([focusGroupId]);
            });
        });

        describe("#changeFocusFor()", function () {
            var focusGroupId,
                mockElement;
            beforeEach(function () {
                mockElement = [{focus: sinon.spy()}];

                focusGroupId = fastFocusFocuser.createFocusGroup();
                fastFocusFocuser.setFocusOn(focusGroupId, 12, mockElement);
            });

            it("should focus the element associated with the model value in the given group when called", function () {
                expect(mockElement[0].focus.called).to.be.false;

                fastFocusFocuser.changeFocusFor(focusGroupId, 12);

                expect(mockElement[0].focus.called).to.be.true;
            });

            it("should do nothing if the supplied group ID does not reference a group", function () {
                fastFocusFocuser.changeFocusFor('garbage value', 12);

                expect(mockElement[0].focus.called).to.be.false;
            });

            it("should do nothing if the group ID is valid but there is no element associated with the model value", function () {
                fastFocusFocuser.changeFocusFor('garbage value', 99);

                expect(mockElement[0].focus.called).to.be.false;
            });
        });

        describe("#setFocusOn()", function () {
            var focusGroupId;
            beforeEach(function () {
                focusGroupId = fastFocusFocuser.createFocusGroup();
                expect(fastFocusFocuser.getActiveFocusGroups()).to.deep.equal([focusGroupId]);
            });

            it("should throw an exception if the supplied group ID does not reference a group", function () {
                expect(function () {
                    fastFocusFocuser.setFocusOn('garbage value', 10, 'element');
                }).to.throw(Error, "Unexpected state: no group 'garbage value'");
            });

            it("should associate an element with a model value in the specified group", function () {
                fastFocusFocuser.setFocusOn(focusGroupId, 10, 'element');
                expect(fastFocusFocuser.getFocusGroup(focusGroupId)).to.deep.equal({10: 'element'});
            });
        });
    });

})();
