import { htmlTextMatcher } from '../html-text/matcher';


describe('htmlTextMatcher fail specs', () => {
    it('positive', () => {
        expect('<div>foo</div>').toEqual(htmlTextMatcher(`bar`));
    });

    it('positive', () => {
        expect('<div>foo</div>').not.toEqual(htmlTextMatcher(`foo`));
    });
});