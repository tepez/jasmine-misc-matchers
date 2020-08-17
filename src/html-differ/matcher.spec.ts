import { executeSpecFile } from '../utils-node';
import { htmlDifferMatcher } from './matcher';
import StripAnsi = require('strip-ansi');


describe('toEqualHtml', () => {
    beforeEach(() => {
        jasmine.addMatchers(htmlDifferMatcher);
    });

    it('success specs', () => {
        expect('<div>xxx</div>').toEqualHtml(`
<div>
    xxx
</div>
`);

        expect('<div data-xxx="foo">xxx</div>').toEqualHtml(`
<div data-xxx="bar">
    xxx
</div>
`, {
            ignoreAttributes: ['data-xxx'],
        });
    });

    it('fail specs', async () => {
        const specs = await executeSpecFile('./src/failSpecs/toEqualHtml.ts');

        // strip colors from output of html-differ to make expectation clearer
        const failedExpectations = specs.map((spec) => spec.failedExpectations);
        failedExpectations[0][0].message = StripAnsi(failedExpectations[0][0].message.trim());

        expect(failedExpectations).toEqual(
            [
                [
                    {
                        matcherName: 'toEqualHtml',
                        message: 'Expected HTML\n<div>foo</div>\nto equal to HTML\n\n<div>\n    bar\n</div>\n\n\n<div>barfoo</div>',
                        stack: jasmine.anything() as any,
                        passed: false,
                        'expected': '\n<div>\n    bar\n</div>\n',
                        'actual': `<div>foo</div>`,
                    },
                ],
                [
                    {
                        matcherName: 'toEqualHtml',
                        message: 'Expected HTML\n<div>foo</div>\nNOT to equal to HTML\n\n<div>\n    foo\n</div>\n',
                        stack: jasmine.anything() as any,
                        passed: false,
                        'expected': '\n<div>\n    foo\n</div>\n',
                        'actual': `<div>foo</div>`,
                    },
                ],
            ],
        );
    });
});