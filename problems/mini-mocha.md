---
layout: post
title: Random String Generator
permalink: /problems/mini-mocha.html
---


[mochajs](http://mochajs.org/) is a testing framework in JavaScript. You can find a minimal implementation of synchronous mocha api at [ciju/mini-mocha](https://github.com/ciju/mini-mocha). Your task is to write asynchronous api and the corresponding tests, of the mocha api.

Clone the repository and then run `npm install` to setup install dependencies. run `npm start` to test the current implementation. Its output should match with ‘output.txt’. The code supports synchronous test. Write some [asynchronous tests](http://mochajs.org/#asynchronous-code). Modify (or rewrite) the implementation to pass those tests. Ex, second param to `test` (the function which has the testing logic) should take a parameter (lets call it done), and call that parameter with the status of the asynchronous operation.

In code terms, current implementation allows for synchronous tests written as:

```javascript
test('should test ![] === true ', () => {
  assert.equal(![], true);
});
```

Change the implementation to also allow for asynchronous tests, ex:

```javascript
test('should test ![] === true ', (done) => {
  setTimeout(() => {
    try {
      assert.equal(![], true);
      done(); // success case
    } catch (err) {
      done(err); // error case
    }
  });
});
```

Note that the test should be run in the same sequence that they are defined. The output and the execution of individual tests should not be interspersed.
