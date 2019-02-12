import { executeSpecFile } from './utils'

describe('utils', () => {
    // We used to have a testUnhandledRejections method
    // Since jasmine 3 this is not needed since jasmine will fail on its own on unhandled
    // rejections, we include this test to show it
    describe('unhandled rejections', () => {
        describe('fail specs', () => {
            it('fail specs', async () => {
                const specs = await executeSpecFile('./src/failSpecs/testUnhandledRejections.ts');
                expect(specs).toEqual([
                    jasmine.any(Object) as any,
                ]);
                expect(specs[0].status).toBe('failed');
                expect(specs.map((spec) => spec.failedExpectations)).toEqual([
                    [
                        {
                            matcherName: '',
                            message: 'Error: mock error',
                            stack: jasmine.anything() as any,
                            passed: false,
                            expected: '',
                            actual: '',
                        },
                        {
                            matcherName: '',
                            message: 'Failed: mock error',
                            stack: jasmine.anything() as any,
                            passed: false,
                            expected: '',
                            actual: '',
                        },
                    ],
                ]);
            });
        });
    });
});