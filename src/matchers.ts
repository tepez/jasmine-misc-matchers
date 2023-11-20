import * as _ from 'lodash'
import { AllSpyTypes, isJasmineSpy, isSinonSpy } from './spies'
import CustomMatcherFactories = jasmine.CustomMatcherFactories;
import MatchersUtil = jasmine.MatchersUtil;

/**
 * Fixes
 *
 * DEPRECATION: Diff builder should be passed as the third argument to MatchersUtil#equals, not the fourth.
 * See <https://jasmine.github.io/tutorials/upgrading_to_Jasmine_4.0#matchers-cet> for details.
 *
 * Until @types/jasmine fixes this
 */
type FixedEquals = (a: any, b: any, diffBuilder?: jasmine.DiffBuilder) => boolean;

declare global {
    namespace jasmine {
        interface Matchers<T> {
            toHaveBeenCalledWithAt(callIndex: number, expectedArgs: any[]): void;

            toHaveOwnProperty(key: string): void

            toHaveExactKeys(...keys: string[]): void

            // No need to have toHaveBeenCalledTimes since it's part of the jasmine core API
            // we just override it to add support for sinon spies
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
    toHaveBeenCalledWithAt: function (utils) {
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
                    throw new Error(`toHaveBeenCalledWithAt: must be called on a spy, got ${utils.pp(spy)}`);
                }

                const name = getSpyName(spy);

                const diffBuilder = jasmine.DiffBuilder();

                const ret: jasmine.CustomMatcherResult = {
                    pass: wasCalled
                        ? (utils.equals as unknown as FixedEquals)(actualArgs, expectedArgs, diffBuilder)
                        : false,
                };

                if (wasCalled) {
                    if (ret.pass) {
                        ret.message = `Expected spy ${name} NOT to be called with ${utils.pp(expectedArgs)} on call number ${callIndex}`;
                    } else {
                        ret.message = `Expected spy ${name} to be called with ${utils.pp(expectedArgs)} on call number ${callIndex}, but it was called with unexpected arguments:\n${diffBuilder.getMessage()}`;
                    }
                } else {
                    if (ret.pass) {
                        // we'll never reach here, this needs to be handled using a negative matcher
                    } else {
                        ret.message = `Expected spy ${name} to be called with ${utils.pp(expectedArgs)} on call number ${callIndex}, but it was only called ${callCount} times`;
                    }
                }

                return ret;
            },
        };
    },

    // Based on
    // https://github.com/jasmine/jasmine/blob/v3.3.0/lib/jasmine-core/jasmine.js#L4506
    toHaveBeenCalledTimes: function (utils) {
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
                    throw new Error(`toHaveBeenCalledWithAt: must be called on a spy, got ${utils.pp(spy)}`);
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

    toHaveOwnProperty: function (utils) {
        return {
            compare: function (obj: object, key: string) {
                const ret: jasmine.CustomMatcherResult = {
                    pass: Object.prototype.hasOwnProperty.call(obj, key),
                };

                ret.message = ret.pass
                    ? `Expected ${utils.pp(obj)} NOT to have own property ${key}`
                    : `Expected ${utils.pp(obj)} to have own property ${key}`;

                return ret;
            },
        };
    },

    toHaveExactKeys: function (utils) {
        return {
            compare: function (obj: object, ...expectedKeys: string[]) {
                const diffBuilder = jasmine.DiffBuilder();

                const actualKeys = Object.keys(obj).sort();

                const pass = (utils.equals as unknown as FixedEquals)(
                    {
                        missing: _.difference(expectedKeys, actualKeys),
                        extra: _.difference(actualKeys, expectedKeys),
                    },
                    {
                        missing: [],
                        extra: [],
                    },
                    diffBuilder,
                );

                const ret: jasmine.CustomMatcherResult = {
                    pass,
                };

                ret.message = ret.pass
                    ? `Expected ${utils.pp(obj)} NOT to have keys ${expectedKeys.join(',')}`
                    : `Expected ${utils.pp(obj)} to have keys ${expectedKeys.join(',')}, but ${diffBuilder.getMessage()}`;

                return ret;
            },
        };
    },
};

export function JSONStringMatcher<T>(obj: T): jasmine.AsymmetricMatcher<string> {
    return {
        asymmetricMatch: function (json: string, utils: MatchersUtil) {
            let parsedJson;
            try {
                parsedJson = JSON.parse(json)
            } catch (err) {
                return false;
            }
            return utils.equals(obj, parsedJson);
        },
        jasmineToString: function () {
            return `JSON serialization of ${JSON.stringify(obj)}`;
        },
    };
}

export function errorWithMessageMatcher(
    expectedMessage: string | RegExp,
    type?: new (...args: any[]) => Error
): jasmine.AsymmetricMatcher<Error> {
    return {
        asymmetricMatch: function (val: Error) {
            if (!(val instanceof Error)) {
                return false;
            }

            if (expectedMessage instanceof RegExp) {
                if (!expectedMessage.test(val.message)) return false;
            } else {
                if (expectedMessage !== val.message) return false;
            }

            return !type || val instanceof type;
        },
        jasmineToString: function () {
            if (expectedMessage instanceof RegExp) {
                return `Error with message matching ${expectedMessage}`;
            } else {
                return `Error with message ${expectedMessage}`;
            }
        },
    };
}
