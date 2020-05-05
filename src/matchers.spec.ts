import Sinon = require('sinon');
import * as _ from 'lodash'
import { JSONStringMatcher, matchers } from './matchers'
import { AllSpyTypes } from './spies';
import { executeSpecFile } from './utils-node'


interface ISpec {

}

describe('jasmine-misc-matchers', () => {
    // @ts-ignore (spec is never used)
    let spec: ISpec;
    afterEach((): void => spec = null);
    beforeEach(function (this: ISpec) {
        spec = this;
        jasmine.addMatchers(matchers);
    });

    function testAllSpyTypes(runTest: (spy: AllSpyTypes) => void) {
        it('should work with jasmine spy', () => {
            runTest(jasmine.createSpy('mock spy'));
        });

        it('should work with sinon spy', () => {
            runTest(Sinon.spy().named('mock spy'));
        });

        it('should work with sinon stub', () => {
            runTest(Sinon.stub().named('mock spy'));
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

        it('fail specs', async () => {
            const specs = await executeSpecFile('./src/failSpecs/toHaveBeenCalledTimes.ts');


            expect(specs.map((spec) => spec.failedExpectations)).toEqual(
                _.flatten(_.times(3, _.constant([
                    [
                        {
                            matcherName: 'toHaveBeenCalledTimes',
                            message: 'Expected spy mock spy to be called 1 times, but it was called 0 times',
                            stack: jasmine.anything() as any,
                            passed: false,
                            expected: 1 as any,
                            actual: jasmine.anything() as any,
                        },
                        {
                            matcherName: 'toHaveBeenCalledTimes',
                            message: 'Expected spy mock spy to be called 0 times, but it was called 1 times',
                            stack: jasmine.anything() as any,
                            passed: false,
                            expected: 0 as any,
                            actual: jasmine.anything() as any,
                        },
                    ],
                    [
                        {
                            matcherName: 'toHaveBeenCalledTimes',
                            message: 'Expected spy mock spy NOT to be called 0 times',
                            stack: jasmine.anything() as any,
                            passed: false,
                            expected: 0 as any,
                            actual: jasmine.anything() as any,
                        },
                        {
                            matcherName: 'toHaveBeenCalledTimes',
                            message: 'Expected spy mock spy NOT to be called 1 times',
                            stack: jasmine.anything() as any,
                            passed: false,
                            expected: 1 as any,
                            actual: jasmine.anything() as any,
                        },
                    ],
                ]))),
            );
        });
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

        it('fail specs', async () => {
            const specs = await executeSpecFile('./src/failSpecs/toHaveBeenCalledWithAt.ts');

            expect(specs.map((spec) => spec.failedExpectations)).toEqual(
                _.flatten(_.times(3, _.constant([
                    [
                        {
                            matcherName: 'toHaveBeenCalledWithAt',
                            message: `Expected spy mock spy to be called with [ 'a' ] on call number 0, but it was only called 0 times`,
                            stack: jasmine.anything(),
                            passed: false,
                            expected: [
                                0,
                                [
                                    'a',
                                ],
                            ] as any,
                            actual: jasmine.anything() as any,
                        },
                        {
                            matcherName: 'toHaveBeenCalledWithAt',
                            message: `Expected spy mock spy to be called with [ 'a' ] on call number 0, but it was called with unexpected arguments:\nExpected $[0] = 'b' to equal 'a'.`,
                            stack: jasmine.anything(),
                            passed: false,
                            expected: [
                                0,
                                [
                                    'a',
                                ],
                            ] as any,
                            actual: jasmine.anything() as any,
                        },
                    ],
                    [
                        {
                            matcherName: 'toHaveBeenCalledWithAt',
                            message: `Expected spy mock spy NOT to be called with [ 'b' ] on call number 0`,
                            stack: jasmine.anything() as any,
                            passed: false,
                            expected: [
                                0,
                                [
                                    'b',
                                ],
                            ] as any,
                            actual: jasmine.anything() as any,
                        },
                    ],
                ]))),
            );
        });
    });

    describe('.toHaveExactKeys()', () => {
        it('success specs', () => {
            expect({}).toHaveExactKeys();

            expect({
                key1: 'value 1',
                key2: 'value 2',
            }).toHaveExactKeys('key1', 'key2');

            expect({
                key1: 'value 1',
                key2: 'value 2',
            }).not.toHaveExactKeys('key1', 'key2', 'key3');
        });

        it('fail specs', async () => {
            const specs = await executeSpecFile('./src/failSpecs/toHaveExactKeys.ts');

            expect(specs.map((spec) => spec.failedExpectations)).toEqual(
                [
                    [
                        {
                            matcherName: 'toHaveExactKeys',
                            message: `Expected Object({  }) to have keys key1,key2, but Expected $.missing.length = 2 to equal 0.
Unexpected $.missing[0] = 'key1' in array.
Unexpected $.missing[1] = 'key2' in array.`,
                            stack: jasmine.anything(),
                            passed: false,
                            expected: [
                                'key1',
                                'key2',
                            ] as any,
                            actual: jasmine.anything() as any,
                        },
                        {
                            matcherName: 'toHaveExactKeys',
                            message: `Expected Object({ key1: 'value', key2: 'value', key3: 'value' }) to have keys key1,key2, but Expected $.extra.length = 1 to equal 0.
Unexpected $.extra[0] = 'key3' in array.`,
                            stack: jasmine.anything(),
                            passed: false,
                            expected: [
                                'key1',
                                'key2',
                            ] as any,
                            actual: jasmine.anything() as any,
                        },
                    ],
                    [
                        {
                            matcherName: 'toHaveExactKeys',
                            message: `Expected Object({ key1: 'value', key2: 'value' }) NOT to have keys key1,key2`,
                            stack: jasmine.anything(),
                            passed: false,
                            expected: [
                                'key1',
                                'key2',
                            ] as any,
                            actual: jasmine.anything() as any,
                        },
                    ],
                ],
            );
        });
    });

    describe('.toHaveOwnProperty()', () => {
        it('success specs', () => {
            expect({
                key1: 'value 1',
                key2: 'value 2',
            }).toHaveOwnProperty('key1');

            expect({
                key1: 'value 1',
                key2: 'value 2',
            }).toHaveOwnProperty('key2');

            expect({
                key1: 'value 1',
                key2: 'value 2',
            }).not.toHaveOwnProperty('key3');
        });

        it('fail specs', async () => {
            const specs = await executeSpecFile('./src/failSpecs/toHaveOwnProperty.ts');

            expect(specs.map((spec) => spec.failedExpectations)).toEqual(
                [
                    [
                        {
                            matcherName: 'toHaveOwnProperty',
                            message: `Expected Object({  }) to have own property key1`,
                            stack: jasmine.anything(),
                            passed: false,
                            expected: 'key1',
                            actual: jasmine.anything() as any,
                        },
                        {
                            matcherName: 'toHaveOwnProperty',
                            message: `Expected Object({ key2: 'value', key3: 'value' }) to have own property key1`,
                            stack: jasmine.anything(),
                            passed: false,
                            expected: 'key1',
                            actual: jasmine.anything() as any,
                        },
                    ],
                    [
                        {
                            matcherName: 'toHaveOwnProperty',
                            message: `Expected Object({ key1: 'value', key2: 'value' }) NOT to have own property key1`,
                            stack: jasmine.anything(),
                            passed: false,
                            expected: 'key1',
                            actual: jasmine.anything() as any,
                        },
                    ],
                ],
            );
        });
    });

    it('JSONStringMatcher', () => {
        expect('{"a": "b"}').toEqual(JSONStringMatcher({ a: 'b' }));
        expect('{"a": "b"}').not.toEqual(JSONStringMatcher({ a: 'c' }));
        expect('xxx').not.toEqual(JSONStringMatcher({}));
    });
});
