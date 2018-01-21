declare global {
    namespace jasmine {
        interface Matchers<T> {
            toHaveBeenCalledWithAt(callIndex: number, expectedArgs: any[]): void;
        }
    }
}

export const matchers = {
    toHaveBeenCalledWithAt: function () {
        return {
            compare: function (spy: jasmine.Spy, callIndex, expectedArgs) {
                if (!(<any>jasmine).isSpy(spy)) {
                    throw new Error('toHaveBeenCalledWithAt: must be called on spied');
                }
                if (callIndex == null) {
                    throw new Error('toHaveBeenCalledWithAt: must specify callIndex');
                }
                const actualArgs = spy.calls.argsFor(callIndex);
                const ret: jasmine.CustomMatcherResult = {
                    pass: (<any>jasmine).matchersUtil.equals(actualArgs, expectedArgs),
                };
                if (ret.pass) {
                    ret.message = 'Expected spy ' + (<any>spy).and.identity() + ' NOT to be called with ' + jasmine.pp(expectedArgs) + ' on call number ' + callIndex;
                } else {
                    ret.message = 'Expected spy ' + (<any>spy).and.identity() + ' to be called with ' + jasmine.pp(expectedArgs) + ' on call number ' + callIndex + ', but it was called with ' + jasmine.pp(actualArgs);
                }
                return ret;
            },
        } as jasmine.CustomMatcher;
    },
};



