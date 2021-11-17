import * as Colors from 'colors'
import * as HtmlToText from 'html-to-text';
import { HtmlToTextOptions } from 'html-to-text';


type Normalize = (text: string) => string

const defaultNormalize: Normalize = (str) => {
    return str.replace(/\s+/g, ' ').trim();
}

/**
 * @param expectedText
 * @param convertOptions - defaults to { wordwrap: 100 }
 * @param normalize - Normalize the text prior to comparison, defaults to collapsing trailing spaces
 *  and trimming
 */
export function htmlTextMatcher(
    expectedText: string,
    convertOptions?: HtmlToTextOptions,
    normalize: (text: string) => string = defaultNormalize,
): jasmine.AsymmetricMatcher<string> {
    return {
        asymmetricMatch: (html: string) => {
            const defaultConvertOptions = {
                wordwrap: 100,
            };

            let actualText: string;
            try {
                actualText = HtmlToText.htmlToText(
                    html,
                    convertOptions || defaultConvertOptions,
                )
            } catch (err) {
                console.error(`\nhtmlTextMatcher: Error converting HTML to text: ${err}`);
                return false;
            }

            const normalizedExpectedText = normalize(expectedText);
            const normalizedActualText = normalize(actualText);

            const isMatch = normalizedExpectedText === normalizedActualText;

            if (!isMatch) {
                console.log(Colors.red('htmlTextMatcher: Actual text does not match'));
                console.log(Colors.blue('Actual:'));
                console.log(actualText);
                console.log(Colors.cyan('Expected:'));
                console.log(expectedText);

                console.log(Colors.blue('Actual (normalized):'));
                console.log(normalizedActualText);
                console.log(Colors.cyan('Expected (normalized):'));
                console.log(normalizedExpectedText);
            }

            return isMatch;
        },
        jasmineToString: () => `HTML with text:\n[${expectedText}]`,
    };
}