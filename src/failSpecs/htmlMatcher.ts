import { htmlDifferMatcher, htmlMatcher } from '..';


describe('htmlMatcher fail specs', () => {
    beforeEach(() => {
        jasmine.addMatchers(htmlDifferMatcher);
    });

    it('positive', () => {
        expect('<div>foo</div>').toEqual(htmlMatcher(`
<div>
    bar
</div>
`));
    });

    it('positive', () => {
        expect('<div>foo</div>').not.toEqual(htmlMatcher(`
<div>
    foo
</div>
`));
    });
});