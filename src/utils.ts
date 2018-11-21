import UnhandledRejectionListener = NodeJS.UnhandledRejectionListener;


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
        listener: UnhandledRejectionListener
    }
}

/**
 * Make sure there are no (or just as expected) unhandled promises rejections during
 * current jasmine scope
 */
export function testUnhandledRejections(): void {
    beforeEach(function (this: IUnhandledRejectionsSpec) {
        this.unhandledRejection.actual = [];
        this.unhandledRejection.expected = [];

        this.unhandledRejection.listener = (reason, promise) => {
            console.log('Unhandled Rejection at: Promise', promise, 'reason:', reason);
            this.unhandledRejection.actual.push({
                reason,
                promise,
            })
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
