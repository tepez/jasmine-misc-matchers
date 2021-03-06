import * as Sinon from 'sinon'
import { matchers } from '../matchers'
import { AllSpyTypes } from '../spies'


interface ISpec {
    spy: AllSpyTypes
}

describe('toHaveBeenCalledWithAt fails specs', () => {
    let spec: ISpec;
    afterEach((): void => spec = null);
    beforeEach(function (this: ISpec) {
        spec = this;
    });

    beforeEach(() => {
        jasmine.addMatchers(matchers);
    });

    function testToHaveBeenCalledWithAt() {
        it('positive', () => {
            expect(spec.spy).toHaveBeenCalledWithAt(0, ['a']);

            spec.spy('b');
            expect(spec.spy).toHaveBeenCalledWithAt(0, ['a']);
        });

        it('negative', () => {
            expect(spec.spy).not.toHaveBeenCalledWithAt(0, ['b']);

            spec.spy('b');
            expect(spec.spy).not.toHaveBeenCalledWithAt(0, ['b']);
        });
    }

    describe('jasmine spy', () => {
        beforeEach(() => {
            spec.spy = jasmine.createSpy('mock spy');
        });

        testToHaveBeenCalledWithAt();
    });

    describe('sinon spy', () => {
        beforeEach(() => {
            spec.spy = Sinon.spy().named('mock spy');
        });

        testToHaveBeenCalledWithAt();
    });

    describe('sinon stub', () => {
        beforeEach(() => {
            spec.spy = Sinon.stub().named('mock spy');
        });

        testToHaveBeenCalledWithAt();
    });
});