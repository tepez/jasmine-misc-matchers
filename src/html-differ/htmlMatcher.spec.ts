import { executeSpecFile } from '../utils-node';
import { htmlMatcher } from './matcher';
import StripAnsi = require('strip-ansi');


describe('htmlMatcher', () => {
    it('success specs', () => {
        expect('<p>xxx</p>').toEqual(
            htmlMatcher(`<p>
    xxx
</p>`),
        );

        expect('<p>xxx</p>').toEqual(
            htmlMatcher(`<p>
    xxx <!-- xxx -->
</p>`, {
                ignoreComments: true,
            }),
        );
    });

    it('fail specs', async () => {
        const specs = await executeSpecFile('./src/failSpecs/htmlMatcher.ts');

        // strip colors from output of html-differ to make expectation clearer
        const failedExpectations = specs.map((spec) => spec.failedExpectations);
        failedExpectations[0][0].message = StripAnsi(failedExpectations[0][0].message.trim());

        expect(failedExpectations).toEqual(
            [
                [
                    {
                        matcherName: 'toEqual',
                        message: 'Expected \'<div>foo</div>\' to equal HTML: \n<div>\n    bar\n</div>\n.',
                        stack: jasmine.anything() as any,
                        passed: false,
                        'expected': '\n<div>\n    bar\n</div>\n',
                        'actual': `<div>foo</div>`,
                    },
                ],
                [
                    {
                        matcherName: 'toEqual',
                        message: 'Expected \'<div>foo</div>\' not to equal HTML: \n<div>\n    foo\n</div>\n.',
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