import { htmlDifferMatcher } from '..';


describe('toEqualHtml fail specs', () => {
    beforeEach(() => {
        jasmine.addMatchers(htmlDifferMatcher);
    });

    it('positive', () => {
        expect('<div>foo</div>').toEqualHtml(`
<div>
    bar
</div>
`);
    });

    it('positive', () => {
        expect('<div>foo</div>').not.toEqualHtml(`
<div>
    foo
</div>
`);
    });
});