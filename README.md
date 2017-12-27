# testcafe-reporter-bunyan
[![Build Status](https://travis-ci.org/Bunk/testcafe-reporter-bunyan.svg)](https://travis-ci.org/Bunk/testcafe-reporter-bunyan)

This is the **bunyan** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

<p align="center">
    <img src="https://raw.github.com/Bunk/testcafe-reporter-bunyan/master/media/preview.png" alt="preview" />
</p>

## Install

```
npm install testcafe-reporter-bunyan
```

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter bunyan
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('bunyan') // <-
    .run();
```

## Author
JD Courtoy (https://github.com/bunk)
