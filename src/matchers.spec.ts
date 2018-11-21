import Sinon = require('sinon');
import { AllSpyTypes, matchers } from './'
import { JSONStringMatcher } from './matchers'


interface ISpec {

}

describe('jasmine-misc-matchers', () => {
    let spec: ISpec;
    afterEach(() => spec = null);
    beforeEach(function () {
        spec = this;
        jasmine.addMatchers(matchers);
    });

    function testAllSpyTypes(runTest: (spy: AllSpyTypes) => void) {
        it('should work with jasmine spy', () => {
            runTest(jasmine.createSpy('mock spy'));
        });

        it('should work with sinon spy', () => {
            runTest(Sinon.spy());
        });

        it('should work with sinon stub', () => {
            runTest(Sinon.stub());
        });
    }

    describe('toHaveBeenCalledTimes', () => {
        function testToHaveBeenCalledTimes(spy: AllSpyTypes) {
            expect(spy).toHaveBeenCalledTimes(0);
            expect(spy).not.toHaveBeenCalledTimes(1);

            spy(1, 2, 3);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).not.toHaveBeenCalledTimes(0);

            spy(1, 2, 3);

            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy).not.toHaveBeenCalledTimes(1);
        }

        testAllSpyTypes(testToHaveBeenCalledTimes);
    });

    describe('toHaveBeenCalledWithAt', () => {
        function testToHaveBeenCalledWithAt(spy: AllSpyTypes) {
            expect(spy).not.toHaveBeenCalledWithAt(0, [1, 2, 3]);
            expect(spy).not.toHaveBeenCalledWithAt(0, [1, 2]);

            spy(1, 2, 3);

            expect(spy).toHaveBeenCalledWithAt(0, [1, 2, 3]);
            expect(spy).not.toHaveBeenCalledWithAt(0, [1, 2]);

            spy(4, 5, 6);

            expect(spy).toHaveBeenCalledWithAt(1, [4, 5, 6]);
            expect(spy).not.toHaveBeenCalledWithAt(1, [1, 2, 3]);
            expect(spy).not.toHaveBeenCalledWithAt(1, []);
        }

        testAllSpyTypes(testToHaveBeenCalledWithAt);
    });


    it('JSONStringMatcher', () => {
        expect('{"a": "b"}').toEqual(JSONStringMatcher({ a: 'b' }));
        expect('{"a": "b"}').not.toEqual(JSONStringMatcher({ a: 'c' }));
        expect('xxx').not.toEqual(JSONStringMatcher({}));
    });
});
