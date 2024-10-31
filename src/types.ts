/**
 * Fixes typing of utils.equals to allow passing diffBuilder
 */
export type FixedMatchersUtilEquals = (a: any, b: any, diffBuilder?: jasmine.DiffBuilder) => boolean;
/**
 * Fixes typings of jasmine.DiffBuilder, its is a constructor, not a function
 */
export type FixedJasmineDiffBuilder = {
    new(): jasmine.DiffBuilder
}