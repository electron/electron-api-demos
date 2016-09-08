# Contributing to Electron API Demos

[![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com)

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

This project adheres to the Contributor Covenant [code of conduct](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable
behavior to [electron@github.com](mailto:electron@github.com).

**See the [documentation](docs.md) for information on how this project works.**

## Code Style & ES6

This project uses the [JavaScript Standard](http://standardjs.com) style and limited E6 syntax.

Because this project is intended for beginners we stick to mostly vanilla JavaScript. One of the features we want illustrate about Electron, however, is that you can use most of ES6 out of the box. To that end, in this project we use these parts of ES6:

- [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
- [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
- [string templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

## Pull Requests and Issues

Tips for making an easier-to-reivew contribution:

- Please provide a description.
- Include screenshots and animated GIFs whenever possible.
- Use short, present tense commit messages.

## Releasing

Releases are created by the core team using the following steps:

1. Check your dependencies: `rm -rf node_modules && npm install`
2. Make sure tests are passing: `npm run test`
3. Increment the major, minor or patch `version` in `package.json`
4. Prepare the release: `npm run prepare-release`
 - _This packages and signs all the assets._
5. Release! `npm run release`
 - _This creates the release on GitHub.com and uploads the assets._
