const Jasmine = require('jasmine');

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
