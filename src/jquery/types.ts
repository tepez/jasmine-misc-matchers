// Avoid TS2669: Augmentations for the global scope can only be directly nested in external modules or ambient module declarations
import { IHtmlDifferOptions, IReportOptions } from 'html-differ';

export {}

// Based on https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0aa7d070e915beb8e1debaa786755beed317465e/types/jasmine-jquery/index.d.ts#L1
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jasmine {
        // eslint-disable-next-line @typescript-eslint/interface-name-prefix
        interface Matchers<T> {
            /**
             * Check if DOM element has class.
             *
             * @param className Name of the class to check.
             *
             * @example
             * // returns true
             * expect($('<div class="some-class"></div>')).toHaveClass("some-class")
             */
            toHaveClass(className: string): void

            /**
             * Check if DOM element has the given CSS properties.
             *
             * @param css Object containing the properties (and values) to check.
             *
             * @example
             * // returns true
             * expect($('<div style="display: none; margin: 10px;"></div>')).toHaveCss({display: "none", margin: "10px"})
             *
             * @example
             * // returns true
             * expect($('<div style="display: none; margin: 10px;"></div>')).toHaveCss({margin: "10px"})
             */
            toHaveCss(css: any): void

            /**
             * Checks if DOM element is visible.
             * Elements are considered visible if they consume space in the document. Visible elements have a width or height that is greater than zero.
             */
            toBeVisible(): void

            /**
             * Check if DOM element is hidden.
             * Elements can be hidden for several reasons:
             * - They have a CSS display value of none ;
             * - They are form elements with type equal to hidden.
             * - Their width and height are explicitly set to 0.
             * - An ancestor element is hidden, so the element is not shown on the page.
             */
            toBeHidden(): void

            /**
             * Only for tags that have checked attribute
             *
             * @example
             * // returns true
             * expect($('<option selected="selected"></option>')).toBeSelected()
             */
            toBeSelected(): void

            /**
             * Only for tags that have checked attribute
             * @example
             * // returns true
             * expect($('<input type="checkbox" checked="checked"/>')).toBeChecked()
             */
            toBeChecked(): void

            /**
             * Checks for child DOM elements or text
             */
            toBeEmpty(): void

            /**
             * Checks if element exists in or out the DOM.
             */
            toExist(): void

            /**
             * Checks if array has the given length.
             *
             * @param length Expected length
             */
            toHaveLength(length: number): void

            /**
             * Check if DOM element contains an attribute and, optionally, if the value of the attribute is equal to the expected one.
             *
             * @param attributeName Name of the attribute to check
             * @param expectedAttributeValue Expected attribute value
             */
            toHaveAttr(attributeName: string, expectedAttributeValue?: any): void

            /**
             * Check if DOM element contains a property and, optionally, if the value of the property is equal to the expected one.
             *
             * @param propertyName Property name to check
             * @param expectedPropertyValue Expected property value
             */
            toHaveProp(propertyName: string, expectedPropertyValue?: any): void

            /**
             * Check if DOM element has the given Id
             *
             * @param id
             */
            toHaveId(id: string): void

            /**
             * Check if DOM element has the specified HTML.
             *
             * @example
             * // returns true
             * expect($('<div><span></span></div>')).toHaveHtml('<span></span>')
             */
            toHaveHtml(
                html: string,
                differOptions?: IHtmlDifferOptions,
                printOptions?: IReportOptions,
            ): void

            /**
             * Check if DOM element contains the specified HTML.
             *
             * @example
             * // returns true
             * expect($('<div><ul></ul><h1>header</h1></div>')).toContainHtml('<ul></ul>')
             */
            toContainHtml(html: string): void

            /**
             * Check if DOM element has the given Text.
             * @param text Accepts a string or regular expression
             *
             * @example
             * // returns true
             * expect($('<div>some text</div>')).toHaveText('some text')
             */
            toHaveText(text: string): void

            /**
             * Check if DOM element contains the specified text.
             *
             * @example
             * // returns true
             * expect($('<div><ul></ul><h1>header</h1></div>')).toContainText('header')
             */
            toContainText(text: string): void

            /**
             * Check if DOM element has the given value.
             * This can only be applied for element on with jQuery val() can be called.
             *
             * @example
             * // returns true
             * expect($('<input type="text" value="some text"/>')).toHaveValue('some text')
             */
            toHaveValue(value: string): void

            /**
             * Check if DOM element has the given data.
             * This can only be applied for element on with jQuery data(key) can be called.
             *
             */
            toHaveData(key: string, expectedValue: string): void

            toBe(selector: T): void

            /**
             * Check if DOM element is matched by the given selector.
             *
             * @example
             * // returns true
             * expect($('<div><span class="some-class"></span></div>')).toContain('some-class')
             */
            toContain(selector: any): void

            /**
             * Check if DOM element exists inside the given parent element.
             *
             * @example
             * // returns true
             * expect($('<div><span class="some-class"></span></div>')).toContainElement('span.some-class')
             */
            toContainElement(selector: string): void

            /**
             * Check to see if the set of matched elements matches the given selector
             *
             * @example
             * expect($('<span></span>').addClass('js-something')).toBeMatchedBy('.js-something')
             *
             * @returns {Boolean} true if DOM contains the element
             */
            toBeMatchedBy(selector: string): void

            /**
             * Only for tags that have disabled attribute
             * @example
             * // returns true
             * expect('<input type="submit" disabled="disabled"/>').toBeDisabled()
             */
            toBeDisabled(): void

            /**
             * Check if DOM element is focused
             * @example
             * // returns true
             * expect($('<input type="text" />').focus()).toBeFocused()
             */
            toBeFocused(): void

            /**
             * Checks to see if the matched element is attached to the DOM.
             * @example
             * expect($('#id-name')[0]).toBeInDOM()
             */
            toBeInDOM(): void
        }
    }
}