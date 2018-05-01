import { matchers } from './'
import { JSONStringMatcher } from './matchers'


interface ISpec {

}

describe('jasmine-misc-matchers', () => {
    let spec: ISpec;
    afterEach(() => spec = null);
    beforeEach(function () {
        spec = this;
    });

    it('toHaveBeenCalledWithAt', () => {
        const spy = jasmine.createSpy('mock spy');
        spy(1, 2, 3);
        jasmine.addMatchers(matchers);
        expect(spy).toHaveBeenCalledWithAt(0, [1, 2, 3]);
        expect(spy).not.toHaveBeenCalledWithAt(0, [1, 2]);
    });

    it('JSONStringMatcher', () => {
       expect('{"a": "b"}').toEqual(JSONStringMatcher({a: 'b'}));
       expect('{"a": "b"}').not.toEqual(JSONStringMatcher({a: 'c'}));
       expect('xxx').not.toEqual(JSONStringMatcher({}));
    });
});