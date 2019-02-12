const Jasmine = require('jasmine');


/**
 * Set the DEFAULT_TIMEOUT_INTERVAL of jasmine in current jasmine scope
 * and restore it after it.
 *
 * @param timeout
 */

export function setSpecTimeout(timeout: number): void {
    let originalTimeout: number;

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

    const beforeGlobal: {
        [key: string]: any
    } = {};
    for (const key of globalVariables) {
        beforeGlobal[key] = (global as any)[key];
    }

    const newJasmine = new Jasmine();

    newJasmine.loadConfig({
        random: false,
    });

    const specs: jasmine.CustomReporterResult[] = [];
    newJasmine.addReporter(new SpecExtractorReporter(specs));

    newJasmine.execute([
        filePath,
    ]);

    await new Promise((resolve) => {
        newJasmine.onComplete(() => {
            for (const key of globalVariables) {
                (global as any)[key] = beforeGlobal[key]
            }

            resolve();
        });
    });

    return specs;
}

