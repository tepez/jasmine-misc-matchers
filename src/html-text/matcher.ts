import * as Colors from 'colors'
import * as HtmlToText from 'html-to-text';
import { HtmlToTextOptions } from 'html-to-text';


/**
 * @param expectedText
 * @param convertOptions - defaults to { wordwrap: 100 }
 */
export function htmlTextMatcher(
    expectedText: string,
    convertOptions?: HtmlToTextOptions,
): jasmine.AsymmetricMatcher<string> {
    return {
        asymmetricMatch: (html: string) => {
            const defaultConvertOptions = {
                wordwrap: 100,
            };

            let actualText;
            try {
                actualText = HtmlToText.htmlToText(
                    html,
                    convertOptions || defaultConvertOptions,
                )
            } catch (err) {
                console.error(`\nhtmlTextMatcher: Error converting HTML to text: ${err}`);
                return false;
            }

            const isMatch = expectedText.replace(/\s+/g, ' ')
                === actualText.replace(/\s+/g, ' ');

            if (!isMatch) {
                console.log(Colors.red('htmlTextMatcher: Actual text does not match'));
                console.log(Colors.blue('Actual:'));
                console.log(actualText);
                console.log(Colors.cyan('Expected:'));
                console.log(expectedText);
            }

            return isMatch;
        },
        jasmineToString: () => `HTML with text:\n[${expectedText}]`,
    };
}