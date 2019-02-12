describe('testUnhandledRejections fail specs', () => {
    it('should fail when there an unexpected rejection', async () => {
        new Promise((_resolve, reject) => {
            reject(new Error('mock error'));
        });
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
});