const Jasmine = require('jasmine');


/**
 * Set the DEFAULT_TIMEOUT_INTERVAL of jasmine in current jasmine scope
 * and restore it after it.
 *
 * @param timeout
 */

export function setSpecTimeout(timeout: number): void {
    let originalTimeout;

    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    });

    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
}

/**
 * Mock the system clock and set it to given date during current jasmine scope
 *
 * @param date
 */
export function mockClock(date: Date): void {
    beforeEach(() => {
        jasmine.clock().install();
        // TODO Open an issue with jasmine asking to add a check for this
        // remove this check if they do it
        if (isNaN(date.getTime())) throw new Error(`mockClock called with an invalid date: ${date}`);
        jasmine.clock().mockDate(date);
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });
}

/**
 * Update the mocked system clock to given date during current jasmine scope
 *
 * @param date
 */
export function updateDate(date: Date): void {
    beforeEach(() => {
        if (isNaN(date.getTime())) throw new Error(`updateDate called with an invalid date: ${date}`);
        jasmine.clock().mockDate(date);
    });
}

/**
 * Serialize and deserialize an object as JSON
 * Useful to simulate how an object is sent in a response
 * @param obj
 * @returns {any}
 */
export function getJsonRep(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
}


export interface IUnhandledRejectionsSpec {
    unhandledRejection: {
        actual: {
            reason: any
            promise: Promise<any>
        }[]
        expected: {
            reason: any
            promise: Promise<any>
        }[]
        // NodeJS.UnhandledRejectionListener
        listener: (reason: any, promise: Promise<any>) => void
    }
}

/**
 * Make sure there are no (or just as expected) unhandled promises rejections during
 * current jasmine scope
 */
export function testUnhandledRejections(): void {
    beforeEach(function (this: IUnhandledRejectionsSpec) {
        this.unhandledRejection = {
            actual: [],
            expected: [],
            listener: (reason, promise) => {
                console.log('Unhandled Rejection at: Promise', promise, 'reason:', reason);
                this.unhandledRejection.actual.push({
                    reason,
                    promise,
                })
            }
        };

        process.on(
            'unhandledRejection',
            this.unhandledRejection.listener,
        );
    });

    afterEach(function (this: IUnhandledRejectionsSpec) {
        process.removeListener(
            'unhandledRejection',
            this.unhandledRejection.listener,
        );
        expect(this.unhandledRejection.actual).toEqual(this.unhandledRejection.expected);
    });
}

/**
 * This reporter accumulates the spec results of a jasmine run
 */
class SpecExtractorReporter implements jasmine.CustomReporter {
    constructor(protected specs: jasmine.CustomReporterResult[]) {

    }

    specDone(spec: jasmine.CustomReporterResult): void {
        this.specs.push(spec);
    }
}

/**
 * Execute the specs a jasmine specs file at given path and return the spec results.
 *
 * Very useful for testing failures of custom matchers.
 *
 * @param filePath
 */
export async function executeSpecFile(filePath: string): Promise<jasmine.CustomReporterResult[]> {
    // Save the global state before the second jasmine instance modifies it
    const globalVariables = [
        'jasmine',

        // https://jasmine.github.io/api/2.9/global
        'afterAll',
        'afterEach',
        'beforeAll',
        'beforeEach',
        'describe',
        'expect',
        'fail',
        'fdescribe',
        'fit',
        'it',
        'pending',
        'spyOn',
        'spyOnProperty',
        'xdescribe',
        'xit',
    ];

    const beforeGlobal = {};
    for (const key of globalVariables) {
        beforeGlobal[key] = global[key];
    }

    const newJasmine = new Jasmine();

    const specs: jasmine.CustomReporterResult[] = [];
    newJasmine.addReporter(new SpecExtractorReporter(specs));

    newJasmine.execute([
        filePath,
    ]);

    await new Promise((resolve) => {
        newJasmine.onComplete((passed) => {
            for (const key of globalVariables) {
                global[key] = beforeGlobal[key]
            }

            resolve();
        });
    });

    return specs;
}

