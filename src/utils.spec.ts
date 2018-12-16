import { IUnhandledRejectionsSpec, testUnhandledRejections } from '..'
import { executeSpecFile } from './utils'

interface ISpec extends IUnhandledRejectionsSpec {

}

describe('utils', () => {
    let spec: ISpec;
    afterEach(() => spec = null);
    beforeEach(function () {
        spec = this;
    });

    describe('.testUnhandledRejections()', () => {
        describe('success specs', () => {
            testUnhandledRejections();

            it('should test test accumulate unhandled rejection', async () => {
                const promise = new Promise((resolve, reject) => {
                    reject(new Error('mock error'));
                });
                await new Promise((resolve) => setTimeout(resolve, 0));
                expect(spec.unhandledRejection.actual).toEqual([
                    {
                        reason: new Error('mock error'),
                        promise,
                    },
                ]);
                spec.unhandledRejection.expected.push({
                    reason: new Error('mock error'),
                    promise,
                })
            });
        });

        describe('fail specs', () => {
            it('fail specs', async () => {
                const specs = await executeSpecFile('./src/failSpecs/testUnhandledRejections.ts');
                expect(specs.map((spec) => spec.failedExpectations)).toEqual([
                    [
                        {
                            matcherName: 'toEqual',
                            message: 'Expected $.length = 1 to equal 0.\nExpected $[0] = Object({ reason: Error: mock error, promise: [object Promise] }) to equal undefined.',
                            stack: jasmine.anything() as any,
                            passed: false,
                            expected: [] as any,
                            actual: [
                                {
                                    reason: new Error('mock error'),
                                    promise: jasmine.any(Promise),
                                },
                            ] as any,
                        },
                    ],
                ]);
            });
        });
    });
});