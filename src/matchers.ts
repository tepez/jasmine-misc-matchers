import { AllSpyTypes, isJasmineSpy, isSinonSpy } from './spies'
import CustomMatcherFactories = jasmine.CustomMatcherFactories;


declare global {
    namespace jasmine {
        interface Matchers<T> {
            toHaveBeenCalledWithAt(callIndex: number, expectedArgs: any[]): void;

            // No need to have toHaveBeenCalledTimes since it's part of the jasmine core API
            // we just override it to add support for sinon spies
        }

        // Add typings for undocumented DiffBuilder
        // https://github.com/jasmine/jasmine/blob/v3.3.0/src/core/matchers/DiffBuilder.js#L1
        class DiffBuilder {
            getMessage(): string
        }

        interface MatchersUtil {
            // equals accept a DiffBuilder as optional last argument
            // https://github.com/jasmine/jasmine/blob/v3.3.0/src/core/matchers/matchersUtil.js#L84
            equals(a: any, b: any, customTesters?: CustomEqualityTester[], builder?: DiffBuilder): boolean;
        }
    }
}

function getSpyName(spy: AllSpyTypes): string {
    if (isJasmineSpy(spy)) {
        const identity = (spy as any).and.identity;

        // jasmine3: identity is a string
        if (typeof identity === 'string') {
            return identity;
        }

        // jasmine2: identity is a function
        return identity();
    } else {
        return (spy as any).displayName
    }
}

export const matchers: CustomMatcherFactories = {
    toHaveBeenCalledWithAt: function () {
        return {
            compare: function (spy: AllSpyTypes, callIndex: number, expectedArgs: any[]) {
                let actualArgs: any[];
                let wasCalled: boolean;
                let callCount: number;

                if (!Number.isFinite(callIndex) || callIndex < 0 || !Number.isSafeInteger(callIndex)) {
                    throw new Error(`toHaveBeenCalledWithAt: callIndex must be a positive integer, got ${callIndex}`);
                }

                if (isJasmineSpy(spy)) {
                    callCount = spy.calls.count();
                    wasCalled = callCount > callIndex;
                    if (wasCalled) actualArgs = spy.calls.argsFor(callIndex);

                } else if (isSinonSpy(spy)) {
                    callCount = spy.callCount;
                    wasCalled = callCount > callIndex;

                    if (wasCalled) actualArgs = spy.getCall(callIndex).args;

                } else {
                    throw new Error(`toHaveBeenCalledWithAt: must be called on a spy, got ${jasmine.pp(spy)}`);
                }

                const name = getSpyName(spy);

                const diffBuilder = new jasmine.DiffBuilder();

                const ret: jasmine.CustomMatcherResult = {
                    pass: wasCalled
                        ? jasmine.matchersUtil.equals(actualArgs, expectedArgs, null, diffBuilder)
                        : false,
                };

                if (wasCalled) {
                    if (ret.pass) {
                        ret.message = `Expected spy ${name} NOT to be called with ${jasmine.pp(expectedArgs)} on call number ${callIndex}`;
                    } else {
                        ret.message = `Expected spy ${name} to be called with ${jasmine.pp(expectedArgs)} on call number ${callIndex}, but it was called with unexpected arguments:\n${diffBuilder.getMessage()}`;
                    }
                } else {
                    if (ret.pass) {
                        // we'll never reach here, this needs to be handled using a negative matcher
                    } else {
                        ret.message = `Expected spy ${name} to be called with ${jasmine.pp(expectedArgs)} on call number ${callIndex}, but it was only called ${callCount} times`;
                    }
                }

                return ret;
            },
        };
    },

    // Based on
    // https://github.com/jasmine/jasmine/blob/v3.3.0/lib/jasmine-core/jasmine.js#L4506
    toHaveBeenCalledTimes: function () {
        return {
            compare: function (spy: AllSpyTypes, expected: number) {
                let actualCallTimes: number;

                if (!Number.isFinite(expected) || expected < 0 || !Number.isSafeInteger(expected)) {
                    throw new Error(`toHaveBeenCalledWithAt: expected be a positive integer, got ${expected}`);
                }

                if (isJasmineSpy(spy)) {
                    actualCallTimes = spy.calls.count()

                } else if (isSinonSpy(spy)) {
                    actualCallTimes = spy.callCount;
                } else {
                    throw new Error(`toHaveBeenCalledWithAt: must be called on a spy, got ${jasmine.pp(spy)}`);
                }

                const name = getSpyName(spy);

                const ret: jasmine.CustomMatcherResult = {
                    pass: actualCallTimes === expected,
                };

                if (ret.pass) {
                    ret.message = `Expected spy ${name} NOT to be called ${expected} times`;
                } else {
                    ret.message = `Expected spy ${name} to be called ${expected} times, but it was called ${actualCallTimes} times`;
                }

                return ret;
            },
        };
    },
};

// return `any` because @types/jasmine doesn't allow creating custom matchers yet (at 2.8.6)
export function JSONStringMatcher(obj: any): any {
    return {
        asymmetricMatch: function (json: string) {
            let parsedJson;
            try {
                parsedJson = JSON.parse(json)
            } catch (err) {
                return false;
            }
            return jasmine.matchersUtil.equals(obj, parsedJson);
        },
        jasmineToString: function () {
            return `JSON serialization of ${JSON.stringify(obj)}`;
        },
    };
}
