# jasmine-misc-matchers
> Various matchers for jasmine2

[![npm version](https://badge.fury.io/js/%40tepez%2Fjasmine-misc-matchers.svg)](https://badge.fury.io/js/%40tepez%2Fjasmine-misc-matchers)
[![Build Status](https://secure.travis-ci.org/tepez/jasmine-misc-matchers.svg?branch=master)](http://travis-ci.org/tepez/jasmine-misc-matchers)

## Install

```
npm install --save @tepez/jasmine-misc-matchers
```

## Usage
```js
const { matchers, JSONStringMatcher } = require('@tepez/jasmine-misc-matchers');

beforeEach(() => {
    jasmine.addMatchers(matchers);
});

it('toHaveBeenCalledWithAt', () => {
    const spy = jasmine.createSpy('mock spy');
    spy(1, 2, 3);
    expect(spy).toHaveBeenCalledWithAt(0, [1, 2, 3]);
});

it('JSONStringMatcher', () => {
    expect('{"a": "b"}').toEqual(JSONStringMatcher({a: 'b'}));
});
```


## API

### Custom matchers

#### Spies

Both jasmine and sinon spies are supported.

* expect(spy: jasmine.Spy).toHaveBeenCalledWithAt(callIndex: number, expectedArgs: any[])

Expects the call arguments of the `callIndex` call to a spied-on function to equal exactly `expectedArgs`.

* expect(spy: jasmine.Spy).toHaveBeenCalledWithAt(callIndex: number, expectedArgs: any[])

Expects the spy to have been called exactly

#### Misc

* toHaveOwnProperties
* toHaveExactKeys

### Custom asymmetric equality tester

* JSONStringMatcher(obj)

Tests weather a string is a JSON serialization of given `obj`.

### Utilities

* setSpecTimeout(timeout: number): void
* mockClock(date: Date): void
* updateDate(date: Date): void
* getJsonRep(obj: any): any


#### Nodejs specific functions

* executeSpecFile(filePath: string): Promise<jasmine.CustomReporterResult[]>

Execute the specs a jasmine specs file at given path and return the spec results.
Very useful for testing failures of custom matchers.

* setLongTimeoutOnDebug()

Set very long timeout if running the specs in debug.

* isDebug()

Return true if runnig in debug mode.