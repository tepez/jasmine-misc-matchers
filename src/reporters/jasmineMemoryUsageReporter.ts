import { assignToPartial } from '@tepez/ts-utils';
import { info } from 'console';
import * as CsvStringify from 'csv-stringify';
import { Stringifier } from 'csv-stringify';
import * as Fs from 'fs'
import SpecResult = jasmine.SpecResult;


export interface IJasmineMemoryUsageReporterOptions {
    events?: {
        /**
         * Log memory usage on specStarted event
         * @default false
         */
        specStarted?: boolean

        /**
         * Log memory usage on specDone event
         * @default true
         */
        specDone?: boolean
    }

    /**
     * The name of the CSV file where the results will be saved
     * @default jasmine-memory-usage.csv
     */
    filepath?: string
}

/**
 * Custom reporter for logging the memory usage before/after every spec to a CSV file
 */
export class JasmineMemoryUsageReporter implements jasmine.CustomReporter {
    protected options: IJasmineMemoryUsageReporterOptions;
    protected csvStream: Stringifier
    protected prevUsage: NodeJS.MemoryUsage;

    constructor(options?: IJasmineMemoryUsageReporterOptions) {
        this.options = assignToPartial({
            events: assignToPartial({
                specDone: true,
                specStarted: false,
            }, options?.events),
            filepath: 'jasmine-memory-usage.csv',
        }, options);
    }

    jasmineStarted(): void {
        info(`Writing memory usage to ${this.options.filepath}`);

        this.prevUsage = process.memoryUsage();

        this.csvStream = CsvStringify({
            header: true,
            bom: true,
        });

        this.csvStream
            .pipe(Fs.createWriteStream(this.options.filepath));
    }

    protected loadSpecEvent(result: SpecResult, event: 'specStarted' | 'specDone'): void {
        if (!this.options.events[event]) return;

        const memoryUsage = process.memoryUsage();
        this.csvStream.write({
            specId: result.id,
            specFullName: result.fullName,
            event: event,
            rss: memoryUsage.rss,
            heapTotal: memoryUsage.heapTotal,
            heapUsed: memoryUsage.heapUsed,
            external: memoryUsage.external,
            arrayBuffers: memoryUsage.arrayBuffers,
            diff_rss: memoryUsage.rss - this.prevUsage.rss,
            diff_heapTotal: memoryUsage.heapTotal - this.prevUsage.heapTotal,
            diff_heapUsed: memoryUsage.heapUsed - this.prevUsage.heapUsed,
            diff_external: memoryUsage.external - this.prevUsage.external,
            diff_arrayBuffers: memoryUsage.arrayBuffers - this.prevUsage.arrayBuffers,
        });
        this.prevUsage = memoryUsage;
    }

    specStarted(result: SpecResult): void {
        this.loadSpecEvent(result, 'specStarted');
    }

    specDone(result: SpecResult): void {
        this.loadSpecEvent(result, 'specDone');
    }

    jasmineDone(): void {
        this.csvStream.end();
    }
}