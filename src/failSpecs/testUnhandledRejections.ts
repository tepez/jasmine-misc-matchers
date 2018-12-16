import { IUnhandledRejectionsSpec, testUnhandledRejections } from '..';

interface ISpec extends IUnhandledRejectionsSpec {

}

describe('testUnhandledRejections fail specs', () => {
    let spec: ISpec;
    afterEach(() => spec = null);
    beforeEach(function () {
        spec = this;
    });

    testUnhandledRejections();

    it('should fail when there an unexpected rejection', async () => {
        new Promise((resolve, reject) => {
            reject(new Error('mock error'));
        });
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
});