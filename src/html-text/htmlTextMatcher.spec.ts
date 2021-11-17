import { executeSpecFile } from '../utils-node';
import { htmlTextMatcher } from './matcher';
import StripAnsi = require('strip-ansi');


describe('htmlTextMatcher', () => {
    it('success specs', () => {
        expect('<p>xxx</p>').toEqual(
            htmlTextMatcher(`xxx`),
        );

        expect('<p>x x x</p>').toEqual(
            htmlTextMatcher(`x\nx\nx`, {
                wordwrap: 1,
            }),
        );
    });

    it('fail specs', async () => {
        const specs = await executeSpecFile('./src/failSpecs/htmlTextMatcher.ts');

        // strip colors from output of html-differ to make expectation clearer
        const failedExpectations = specs.map((spec) => spec.failedExpectations);
        failedExpectations[0][0].message = StripAnsi(failedExpectations[0][0].message.trim());

        expect(failedExpectations).toEqual(
            [
                [
                    {
                        matcherName: 'toEqual',
                        message: `Expected '<div>foo</div>' to equal HTML with text:\n[bar].`,
                        stack: jasmine.anything() as any,
                        passed: false,
                        'expected': '\n<div>\n    bar\n</div>\n',
                        'actual': `<div>foo</div>`,
                    },
                ],
                [
                    {
                        matcherName: 'toEqual',
                        message: `Expected '<div>foo</div>' not to equal HTML with text:\n[foo].`,
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