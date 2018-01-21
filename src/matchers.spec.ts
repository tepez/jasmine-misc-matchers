import { matchers } from './'

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
});