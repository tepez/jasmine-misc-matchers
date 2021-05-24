import * as Inspector from 'inspector'
import * as _ from 'lodash'
import { setSpecTimeout } from './utils'


/**
 * This reporter accumulates the spec results of a jasmine run
 */
class SpecExtractorReporter implements jasmine.CustomReporter {
    constructor(protected specs: jasmine.SpecResult[]) {

    }

    specDone(spec: jasmine.SpecResult): void {
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
export async function executeSpecFile(filePath: string): Promise<jasmine.SpecResult[]> {
    let Jasmine;
    try {
        Jasmine = require('jasmine');
    } catch (err) {
        console.error(`jasmine-misc-matchers could not require "jasmine". It should be installed if you want to use executeSpecFile`);
        throw err;
    }

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

    const specs: jasmine.SpecResult[] = [];
    newJasmine.addReporter(new SpecExtractorReporter(specs));

    newJasmine.execute([
        filePath,
    ]);

    await new Promise<void>((resolve) => {
        newJasmine.onComplete(() => {
            for (const key of globalVariables) {
                (global as any)[key] = beforeGlobal[key]
            }

            resolve();
        });
    });

    return specs;
}

/**
 * Return true if running the process in debug mode
 *
 * https://stackoverflow.com/a/45074641/1705056
 * https://github.com/IonicaBizau/debug-mode/blob/master/lib/index.js#L12
 */
export function isDebug(): boolean {
    if (typeof process === 'undefined') return false;

    return /--debug|--inspect/.test(process.execArgv.join(' '))
        || !!Inspector.url();
}

/**
 * Set very long timeout if running the specs in debug
 *
 * This allows to debug the specs without jasmine failing them due to timeout
 */
export function setLongTimeoutOnDebug(): void {
    if (isDebug()) {
        console.log(`jasmine-misc-matchers: Setting long specs timeout because running specs in debug mode`);
        setSpecTimeout(999999);
    }
}

/**
 * Copy process.env before each spec and restore it after it
 */
export function backupAndRestoreEnv(): void {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
        env = _.cloneDeep(process.env);
    });

    afterEach(() => {
        process.env = env;
    });
}