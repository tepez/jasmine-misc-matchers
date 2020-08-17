declare module 'html-differ' {
    export interface IHtmlDifferOptions {
        /**
         * Sets what kind of respective attributes' content will be ignored during the comparison (default: []).
         */
        ignoreAttributes?: string[]

        /**
         * Sets what kind of respective attributes' content will be compared as JSON objects, but not as strings (default: []).
         */
        compareAttributesAsJSON?: string[]

        /**
         * Makes html-differ ignore whitespaces (spaces, tabs, new lines etc.) during the comparison (default: true).
         */
        ignoreWhitespaces?: boolean

        /**
         * Makes html-differ ignore HTML comments during the comparison (default: true).
         */
        ignoreComments?: boolean

        /**
         * Makes html-differ ignore end tags during the comparison (default: false).
         */
        ignoreEndTags?: boolean

        /**
         * Makes html-differ ignore tags' duplicate attributes during the comparison.
         From the list of the same tag's attributes, the attribute which goes the first will be taken for comparison, others will be ignored (default: false).
         */
        ignoreDuplicateAttributes?: boolean
    }

    export type HtmlDifferPreset =
        | 'bem'

    export interface IDiff {
        value: string
        added?: string
        removed?: string
    }

    export interface IReportOptions {
        /**
         * the number of characters around the diff result between two HTML (default: 40).
         */
        charsAroundDiff?: number
    }

    export class HtmlDiffer {
        constructor(options?: IHtmlDifferOptions | HtmlDifferPreset)

        diffHtml(html1: string, html2: string): IDiff[]

        isEqual(html1: string, html2: string): boolean
    }
}

declare module 'html-differ/lib/logger' {
    import { IDiff, IReportOptions } from 'html-differ';

    export function getDiffText(diffs: IDiff[], options?: IReportOptions): string

    export function logDiffText(diffs: IDiff[], options?: IReportOptions): string
}