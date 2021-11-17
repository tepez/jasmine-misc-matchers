import { htmlMatcher } from '..';


describe('htmlMatcher fail specs', () => {
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