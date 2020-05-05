import { matchers } from '../matchers'


describe('toHaveExactKeys fails specs', () => {
    beforeEach(() => {
        jasmine.addMatchers(matchers);
    });

    it('positive', () => {
        expect({}).toHaveExactKeys('key1', 'key2');

        expect({
            key1: 'value',
            key2: 'value',
            key3: 'value',
        }).toHaveExactKeys('key1', 'key2');
    });

    it('negative', () => {
        expect({
            key1: 'value',
            key2: 'value',
        }).not.toHaveExactKeys('key1', 'key2');
    });
});