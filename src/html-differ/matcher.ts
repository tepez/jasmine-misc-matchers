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

export const htmlDifferMatcher: CustomMatcherFactories = {
    toEqualHtml: () => {
        {
            return {
                compare: (
                    html: string,
                    expectedHtml: string,
                    differOptions: IHtmlDifferOptions,
                    printOptions: IReportOptions,
                ): jasmine.CustomMatcherResult => {
                    const differ = new HtmlDiffer(differOptions)

                    const diff = differ.diffHtml(html, expectedHtml);

                    // Check if equal without running diff again (as differ.isEqual would do)
                    // https://github.com/bem/html-differ/blob/v1.4.0/lib/index.js#L61
                    const isEqual = diff.length === 1
                        && !diff[0].added
                        && !diff[0].removed;

                    return {
                        pass: isEqual,
                        message: isEqual
                            ? `Expected HTML\n${html}\nNOT to equal to HTML\n${expectedHtml}`
                            : `Expected HTML\n${html}\nto equal to HTML\n${expectedHtml}\n${getDiffText(diff, printOptions)}`,
                    };
                },
            };
        }
    },
}