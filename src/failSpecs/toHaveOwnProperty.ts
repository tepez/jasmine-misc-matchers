import { matchers } from '../matchers'


describe('toHaveOwnProperty fails specs', () => {
    beforeEach(() => {
        jasmine.addMatchers(matchers);
    });

    it('positive', () => {
        expect({}).toHaveOwnProperty('key1');

        expect({
            key2: 'value',
            key3: 'value',
        }).toHaveOwnProperty('key1');
    });

    it('negative', () => {
        expect({
            key1: 'value',
            key2: 'value',
        }).not.toHaveOwnProperty('key1');
    });
});