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
const { matchers } = require('@tepez/jasmine-misc-matchers');

beforeEach(() => {
    jasmine.addMatchers(matchers);
});

it('toHaveBeenCalledWithAt', () => {
    const spy = jasmine.createSpy('mock spy');
    spy(1, 2, 3);
    expect(spy).toHaveBeenCalledWithAt(0, [1, 2, 3]);
});
```


## API

### Custom matchers
* expect(spy: jasmine.Spy).toHaveBeenCalledWithAt(callIndex: number, expectedArgs: any[])

Expects the call arguments of the `callIndex` call to a spied-on function to equal `expectedArgs`.