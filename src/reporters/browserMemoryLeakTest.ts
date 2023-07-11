import * as FileSaver from 'file-saver';
import { unparse } from 'papaparse';

declare global {
    interface Window {
        /**
         * Force garbage collection function exposed by Chrome if started with --js-flags="--expose-gc"
         *
         * https://stackoverflow.com/a/13951759/1705056
         */
        gc: () => void
    }
}

interface IMemoryInfo {
    totalJSHeapSize: number
    usedJSHeapSize: number
    jsHeapSizeLimit: number
}

interface ISpecMemory extends IMemoryInfo,
    Pick<jasmine.SpecResult,
        | 'id'
        | 'description'
        | 'fullName'
        | 'status'
        | 'duration'
    > {

    diff_totalJSHeapSize: number
    diff_usedJSHeapSize: number
    diff_jsHeapSizeLimit: number
}

/**
 * A jasmine reporter that checks the memory usage before and after each spec
 *
 * After jasmine is done, triggers a download of a CSV report with the memory usage
 *
 * If using karma, add the following settings
 *
 *      browsers: [
 *                 'ChromePreciseMemory',
 *      ],
 *
 *      // probably not needed https://stackoverflow.com/a/54659953/1705056
 *      customLaunchers: {
 *          ChromePreciseMemory: {
 *              base: 'Chrome',
 *              flags: [
 *                  '--enable-precise-memory-info',
 *                  // https://stackoverflow.com/a/13951759/1705056
 *                  '--js-flags="--expose-gc"',
 *              ],
 *          },
 *      },
 */
export class JasmineBrowserMemoryLeaksReporter implements jasmine.CustomReporter {
    protected memoryDiffs: ISpecMemory[];
    protected beforeMemoryInfo: IMemoryInfo;

    jasmineStarted(): void {
        this.memoryDiffs = [];
    }

    specStarted(): void {
        const _memory = (window.performance as any).memory as IMemoryInfo;
        this.beforeMemoryInfo = {
            totalJSHeapSize: _memory.totalJSHeapSize,
            usedJSHeapSize: _memory.usedJSHeapSize,
            jsHeapSizeLimit: _memory.jsHeapSizeLimit,
        };
    }

    specDone(results: jasmine.SpecResult): void {
        window.gc?.();

        const _memory = (window.performance as any).memory as IMemoryInfo;

        this.memoryDiffs.push({
            id: results.id,
            status: results.status,
            duration: results.duration,
            fullName: results.fullName,
            description: results.description,
            totalJSHeapSize: _memory.totalJSHeapSize,
            usedJSHeapSize: _memory.usedJSHeapSize,
            jsHeapSizeLimit: _memory.jsHeapSizeLimit,
            diff_totalJSHeapSize: _memory.totalJSHeapSize - this.beforeMemoryInfo.totalJSHeapSize,
            diff_usedJSHeapSize: _memory.usedJSHeapSize - this.beforeMemoryInfo.usedJSHeapSize,
            diff_jsHeapSizeLimit: _memory.jsHeapSizeLimit - this.beforeMemoryInfo.jsHeapSizeLimit,
        });
    }

    jasmineDone(): void {
        const csv = unparse(
            this.memoryDiffs,
            {
                header: true,
            },
        );

        const blob = new Blob(
            [
                '\ufeff',
                csv,
            ],
            { type: 'text/csv' },
        );

        const timestamp = new Date().toISOString()
            // make valid filename
            .replace(/[-:.]/g, '_');

        FileSaver.saveAs(
            blob,
            `jasmine_memory_report_${timestamp}.csv`,
        );
    }
}

export function testMemoryLeaks(): void {
    jasmine.getEnv().addReporter(new JasmineBrowserMemoryLeaksReporter());
}
