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

