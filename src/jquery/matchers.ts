import { IHtmlDifferOptions, IReportOptions } from 'html-differ';
import * as _ from 'lodash'
import { compareHtml } from '../html-differ/matcher';
import CustomMatcherFactories = jasmine.CustomMatcherFactories;
import CustomMatcherResult = jasmine.CustomMatcherResult;


let _$: JQueryStatic = typeof $ === 'undefined'
    ? null
    : $;

let _window: Window = typeof window === 'undefined'
    ? null
    : window;

/**
 * Allow to set jQuery and window (needed for toBeInDOM).
 *
 * This makes it possible to use these matchers on node, e.g. use @tepez/angularjs-services
 *
 * @param $
 * @param window
 */
export const linkJqueryMatchers = ($: JQueryStatic, window: Window): void => {
    _$ = $;
    _window = window;
}


type Selector = any

declare global {
    // https://github.com/jasmine/jasmine/blob/v3.7.1/src/core/base.js#L126
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jasmine {
        const isDomNode: (val: any) => boolean
    }
}

function browserTagCaseIndependentHtml(html: string): string {
    return _$('<div/>').append(html).html()
}

const compareProperty = function (actualValue: string, expectedValue: string): boolean {
    return expectedValue === undefined
        ? actualValue !== undefined
        : actualValue === expectedValue;
};


const matcherResult = (
    selector: Selector,
    pass: boolean,
    expectedMessage: string,
    actualMessage: string,
): CustomMatcherResult => {
    const ret: jasmine.CustomMatcherResult = {
        pass,
    };

    ret.message = ret.pass
        ? `Expected ${jasmine.pp(selector)} NOT to ${expectedMessage}`
        : `Expected ${jasmine.pp(selector)} to ${expectedMessage}, but it ${actualMessage}`;

    return ret;
}


export const jqueryMatchers: CustomMatcherFactories = {
    toHaveClass: function () {
        return {
            compare: function (actual: Selector, className: string) {
                return { pass: _$(actual).hasClass(className) }
            },
        }
    },

    toHaveCss: function () {
        return {
            compare: function (actual: Selector, css: any) {
                const stripCharsRegex = /[\s;"']/g;
                for (const prop in css) {
                    const value = css[prop]; // see issue #147 on gh
                    if ((value === 'auto') && (_$(actual).get(0).style[prop] === 'auto')) continue
                    const actualStripped = _$(actual).css(prop).replace(stripCharsRegex, '');
                    const valueStripped = value.replace(stripCharsRegex, '');
                    if (actualStripped !== valueStripped) return { pass: false }
                }
                return { pass: true }
            },
        };
    },

    toBeVisible: function () {
        return {
            compare: function (actual: Selector) {
                return { pass: _$(actual).is(':visible') }
            },
        }
    },

    toBeHidden: function () {
        return {
            compare: function (actual: Selector) {
                return { pass: _$(actual).is(':hidden') }
            },
        }
    },

    toBeSelected: function () {
        return {
            compare: function (actual: Selector) {
                return { pass: _$(actual).is(':selected') }
            },
        }
    },

    toBeChecked: function () {
        return {
            compare: function (actual: Selector) {
                return { pass: _$(actual).is(':checked') }
            },
        }
    },

    toBeEmpty: function () {
        return {
            compare: function (actual: Selector) {
                return { pass: _$(actual).is(':empty') }
            },
        }
    },

    toBeInDOM: function () {
        return {
            compare: function (actual: Selector) {
                return { pass: _$.contains(_window.document.documentElement, _$(actual)[0]) }
            },
        }
    },

    toExist: function () {
        return {
            compare: function (actual: Selector) {
                return { pass: !!_$(actual).length }
            },
        }
    },

    toHaveLength: function () {
        return {
            compare: function (actual: Selector, expectedValue: number) {
                const actualValue = _$(actual).length;
                return matcherResult(
                    actual,
                    actualValue === expectedValue,
                    `have length ${expectedValue}`,
                    `has length ${actualValue}`,
                );
            },
        }
    },

    toHaveAttr: function () {
        return {
            compare: function (actual: Selector, attributeName: string, expectedValue: any) {
                const actualValue = _$(actual).attr(attributeName);
                return matcherResult(
                    actual,
                    compareProperty(actualValue, expectedValue),
                    `have attribute ${attributeName}=${expectedValue}`,
                    `has attribute ${attributeName}=${actualValue}`,
                );
            },
        }
    },

    toHaveProp: function () {
        return {
            compare: function (actual: Selector, propertyName: string, expectedValue: any) {
                const actualValue = _$(actual).prop(propertyName);
                return matcherResult(
                    actual,
                    compareProperty(actualValue, expectedValue),
                    `have property ${propertyName}=${expectedValue}`,
                    `has property ${propertyName}=${actualValue}`,
                );
            },
        }
    },

    toHaveId: function () {
        return {
            compare: function (actual: Selector, expectedValue: string) {
                const actualValue = _$(actual).attr('id');
                return matcherResult(
                    actual,
                    actualValue === expectedValue,
                    `have id ${expectedValue}`,
                    `has id ${actualValue}`,
                );
            },
        }
    },

    toHaveHtml: function () {
        return {
            compare: function (
                actual: Selector,
                html: string,
                differOptions?: IHtmlDifferOptions,
                printOptions?: IReportOptions,
            ) {
                return compareHtml(
                    _$(actual).html(),
                    html,
                    differOptions,
                    printOptions,
                );
            },
        }
    },

    toContainHtml: function () {
        return {
            compare: function (actual: Selector, html: string) {
                const actualHtml = _$(actual).html();
                const expectedHtml = browserTagCaseIndependentHtml(html);

                return { pass: (actualHtml.indexOf(expectedHtml) >= 0) }
            },
        }
    },

    toHaveText: function () {
        return {
            compare: function (actual: Selector, expectedValue: string | RegExp) {
                const actualText = _$(actual).text()
                const trimmedText = _$.trim(actualText)

                if (_.isRegExp(expectedValue)) {
                    return matcherResult(
                        actual,
                        expectedValue.test(actualText) || expectedValue.test(trimmedText),
                        `have text matched by ${expectedValue}`,
                        `has text ${actualText}`,
                    );

                } else {
                    return matcherResult(
                        actual,
                        actualText === expectedValue || trimmedText === expectedValue,
                        `have text ${expectedValue}`,
                        `has text ${actualText}`,
                    );
                }
            },
        }
    },

    toContainText: function () {
        return {
            compare: function (actual: Selector, expectedValue: string | RegExp) {
                const trimmedText = _$.trim(_$(actual).text())
                if (_.isRegExp(expectedValue)) {
                    return matcherResult(
                        actual,
                        expectedValue.test(trimmedText),
                        `have text matched by ${expectedValue}`,
                        `has (trimmed) text ${trimmedText}`,
                    );
                } else {
                    return matcherResult(
                        actual,
                        trimmedText.indexOf(expectedValue) !== -1,
                        `have text ${expectedValue}`,
                        `has (trimmed) text ${trimmedText}`,
                    );
                }
            },
        }
    },

    toHaveValue: function () {
        return {
            compare: function (actual: Selector, expectedValue: any) {
                const actualValue = _$(actual).val();
                return matcherResult(
                    actual,
                    actualValue === expectedValue,
                    `have value ${expectedValue}`,
                    `has value ${actualValue}`,
                );
            },
        }
    },

    toHaveData: function () {
        return {
            compare: function (actual: Selector, key: string, expectedValue: any) {
                const actualValue = _$(actual).data(key);
                return matcherResult(
                    actual,
                    compareProperty(actualValue, expectedValue),
                    `have data ${key}=${expectedValue}`,
                    `has data ${key}=${actualValue}`,
                );
            },
        }
    },

    toContainElement: function () {
        return {
            compare: function (actual: Selector, selector: string) {
                return { pass: !!_$(actual).find(selector).length }
            },
        }
    },

    toBeMatchedBy: function () {
        return {
            compare: function (actual: Selector, selector: string) {
                return { pass: !!_$(actual).filter(selector).length }
            },
        }
    },

    toBeDisabled: function () {
        return {
            compare: function (actual: Selector) {
                return { pass: _$(actual).is(':disabled') }
            },
        }
    },

    toBeFocused: function () {
        return {
            compare: function (actual: Selector) {
                return { pass: _$(actual)[0] === _$(actual)[0].ownerDocument.activeElement }
            },
        }
    },
} as const;

export const addJqueryCustomEqualityTesters = (): void => {
    jasmine.getEnv().addCustomEqualityTester((a, b): boolean | void => {
        if (a && b) {
            if (a instanceof _$ || jasmine.isDomNode(a)) {
                const $a = _$(a)

                if (b instanceof _$) {
                    return $a.length === (b as any).length && $a.is(b as any)
                }

                return $a.is(b);
            }

            if (b instanceof _$ || jasmine.isDomNode(b)) {
                const $b = _$(b)

                if (a instanceof _$) {
                    return (a as any).length === $b.length && $b.is(a as any)
                }

                return $b.is(a);
            }
        }
    });

    jasmine.getEnv().addCustomEqualityTester((a, b) => {
        if (a instanceof _$ && b instanceof _$ && (a as any).size() === (b as any).size()) {
            return (a as any).is(b)
        }
    });
};