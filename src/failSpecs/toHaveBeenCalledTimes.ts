import { AllSpyTypes, matchers } from '../matchers';
import * as Sinon from 'sinon'


interface ISpec {
    spy: AllSpyTypes
}

describe('toHaveBeenCalledTimes fails specs', () => {
    let spec: ISpec;
    afterEach(() => spec = null);
    beforeEach(function () {
        spec = this;
    });

    beforeEach(() => {
        jasmine.addMatchers(matchers);
    });

    function testToHaveBeenCalledTimes() {
        it('positive', () => {
            expect(spec.spy).toHaveBeenCalledTimes(1);

            spec.spy();
            expect(spec.spy).toHaveBeenCalledTimes(0);
        });

        it('negative', () => {
            expect(spec.spy).not.toHaveBeenCalledTimes(0);

            spec.spy();
            expect(spec.spy).not.toHaveBeenCalledTimes(1);
        });
    }

    describe('jasmine spy', () => {
        beforeEach(() => {
            spec.spy = jasmine.createSpy('mock spy');
        });

        testToHaveBeenCalledTimes();
    });

    describe('sinon spy', () => {
        beforeEach(() => {
            spec.spy = Sinon.spy().named('mock spy');
        });

        testToHaveBeenCalledTimes();
    });

    describe('sinon stub', () => {
        beforeEach(() => {
            spec.spy = Sinon.stub().named('mock spy');
        });

        testToHaveBeenCalledTimes();
    });
});