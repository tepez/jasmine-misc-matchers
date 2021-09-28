import { HtmlDiffer, IHtmlDifferOptions, IReportOptions } from 'html-differ';
import { getDiffText } from 'html-differ/lib/logger';
import './html-differ'
import CustomMatcherFactories = jasmine.CustomMatcherFactories;


declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jasmine {
        // eslint-disable-next-line @typescript-eslint/interface-name-prefix
        interface Matchers<T> {
            toEqualHtml(
                expectedHtml: string,
                differOptions?: IHtmlDifferOptions,
                printOptions?: IReportOptions,
            ): boolean
        }
    }
}

export const compareHtml = (
    actualHtml: string,
    expectedHtml: string,
    differOptions: IHtmlDifferOptions,
    printOptions: IReportOptions,
): jasmine.CustomMatcherResult => {
    const differ = new HtmlDiffer(differOptions)

    const diff = differ.diffHtml(actualHtml, expectedHtml);

    // Check if equal without running diff again (as differ.isEqual would do)
    // https://github.com/bem/html-differ/blob/v1.4.0/lib/index.js#L61
    const isEqual = diff.length === 1
        && !diff[0].added
        && !diff[0].removed;

    return {
        pass: isEqual,
        message: isEqual
            ? `Expected HTML\n${actualHtml}\nNOT to equal to HTML\n${expectedHtml}`
            : `Expected HTML\n${actualHtml}\nto equal to HTML\n${expectedHtml}\n${getDiffText(diff, printOptions)}`,
    };
}

/**
 * Includes:
 * * toEqualHtml
 */
export const htmlDifferMatcher: CustomMatcherFactories = {
    toEqualHtml: () => {
        {
            return {
                compare: compareHtml,
            };
        }
    },
}

/**
 * Matcher used to compare HTML with toEqual
 *
 * @param expectedHtml
 * @param differOptions
 */
export function htmlMatcher(expectedHtml: string, differOptions?: IHtmlDifferOptions): jasmine.AsymmetricMatcher<string> {
    return {
        asymmetricMatch: function (actualHtml: string) {
            const result = compareHtml(expectedHtml, actualHtml, differOptions, null);
            return result.pass;
        },
        jasmineToString: function () {
            return `HTML: ${expectedHtml}`;
        },
    };
}