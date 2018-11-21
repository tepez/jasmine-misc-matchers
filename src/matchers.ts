import * as Sinon from 'sinon'
import CustomMatcherFactories = jasmine.CustomMatcherFactories;


declare global {
    namespace jasmine {
        interface Matchers<T> {
            toHaveBeenCalledWithAt(callIndex: number, expectedArgs: any[]): void;

            // No need to have toHaveBeenCalledTimes since it's part of the jasmine core API
            // we just override it to add support for sinon spies
        }
    }
}

export type AllSpyTypes = jasmine.Spy | Sinon.SinonStub | Sinon.SinonSpy

function isJasmineSpy(spy: AllSpyTypes): spy is jasmine.Spy {
    return (jasmine as any).isSpy(spy)
}

function isSinonSpy(spy: AllSpyTypes): spy is Sinon.SinonSpy | Sinon.SinonStub {
    return (spy as any).isSinonProxy;
}


export const matchers: CustomMatcherFactories = {
    toHaveBeenCalledWithAt: function () {
        return {
            compare: function (spy: AllSpyTypes, callIndex: number, expectedArgs: any[]) {
                let actualArgs: any[];
                let name: string;
                let wasCalled: boolean;
                let callCount: number;

                if (!Number.isFinite(callIndex) || callIndex < 0 || !Number.isSafeInteger(callIndex)) {
                    throw new Error(`toHaveBeenCalledWithAt: callIndex must be a positive integer, got ${callIndex}`);
                }

                if (isJasmineSpy(spy)) {
                    name = (<any>spy).and.identity();
                    callCount = spy.calls.count();
                    wasCalled = callCount > callIndex;
                    if (wasCalled) actualArgs = spy.calls.argsFor(callIndex);

                } else if (isSinonSpy(spy)) {
                    name = (spy as any).displayName;

                    callCount = spy.callCount;
                    wasCalled = callCount > callIndex;

                    if (wasCalled) actualArgs = spy.getCall(callIndex).args;

                } else {
                    throw new Error(`toHaveBeenCalledWithAt: must be called on a spy, got ${jasmine.pp(spy)}`);
                }

                const ret: jasmine.CustomMatcherResult = {
                    pass: wasCalled
                        ? jasmine.matchersUtil.equals(actualArgs, expectedArgs)
                        : false
                };

                if (wasCalled) {
                    if (ret.pass) {
                        ret.message = `Expected spy ${name} NOT to be called with ${jasmine.pp(expectedArgs)} on call number ${callIndex}`;
                    } else {
                        ret.message = `Expected spy ${name} to be called with ${jasmine.pp(expectedArgs)} on call number ${callIndex}, but it was called with ${jasmine.pp(actualArgs)}`;
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
                let name: string;
                let actualCallTimes: number;

                if (!Number.isFinite(expected) || expected < 0 || !Number.isSafeInteger(expected)) {
                    throw new Error(`toHaveBeenCalledWithAt: expected be a positive integer, got ${expected}`);
                }

                if (isJasmineSpy(spy)) {
                    name = (<any>spy).and.identity();
                    actualCallTimes = spy.calls.count()

                } else if (isSinonSpy(spy)) {
                    name = (spy as any).displayName;
                    actualCallTimes = spy.callCount;
                } else {
                    throw new Error(`toHaveBeenCalledWithAt: must be called on a spy, got ${jasmine.pp(spy)}`);
                }

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
export function JSONStringMatcher(obj): any {
    return {
        asymmetricMatch: function (json) {
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
