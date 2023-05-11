import { executeSpecFile } from './utils-node'

xdescribe('utils', () => {
    // TODO try again with jasmine 4
    // This spec seems to fail because the unhandled promise rejection detection of gulp, set by async-done
    // https://github.com/gulpjs/async-done/blob/v2.0.0/index.js#L31
    // Is triggered instead that of jasmine
    // Not sure how to fix this
    return xit(`This spec is failing. Not sure why. Can't have it block development.`);

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
                            message: 'Unhandled promise rejection: Error: mock error',
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