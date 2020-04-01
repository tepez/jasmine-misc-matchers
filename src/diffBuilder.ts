declare global {
    namespace jasmine {
        /**
         * Add typings for undocumented DiffBuilder
         * https://github.com/jasmine/jasmine/blob/v3.3.0/src/core/matchers/DiffBuilder.js#L1
         */
        class DiffBuilder {
            getMessage(): string
        }

        interface MatchersUtil {
            /**
             * Equals accept a DiffBuilder as optional last argument
             * https://github.com/jasmine/jasmine/blob/v3.3.0/src/core/matchers/matchersUtil.js#L84
             * @param a
             * @param b
             * @param customTesters
             * @param builder
             */
            equals(a: any, b: any, customTesters?: CustomEqualityTester[], builder?: DiffBuilder): boolean;
        }
    }
}

// Make this file a module
export default {}