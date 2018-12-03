import * as Sinon from 'sinon'


export type AllSpyTypes = jasmine.Spy | Sinon.SinonStub | Sinon.SinonSpy

export function isJasmineSpy(spy: AllSpyTypes): spy is jasmine.Spy {
    return (jasmine as any).isSpy(spy)
}

export function isSinonSpy(spy: AllSpyTypes): spy is Sinon.SinonSpy | Sinon.SinonStub {
    return (spy as any).isSinonProxy;
}