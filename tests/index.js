var Application = require('spectron').Application;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var path = require('path');

chai.should();
chai.use(chaiAsPromised);

var afterEach = global.afterEach;
var beforeEach = global.beforeEach;
var describe = global.describe;
var it = global.it;

describe('demo app', function () {
  this.timeout(30000);

  beforeEach(function () {
    this.app = new Application({
      path: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
      args: [
        path.join(__dirname, '..')
      ],
      waitTimeout: 10000
    });
    return this.app.start();
  });

  beforeEach(function () {
    chaiAsPromised.transferPromiseness = this.app.client.transferPromiseness;
  });

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('opens a window displaying the about page and nav bar', function () {
    return this.app.client.waitUntilWindowLoaded()
      .getWindowCount().should.eventually.equal(1)
      .isWindowMinimized().should.eventually.be.false
      .isWindowDevToolsOpened().should.eventually.be.false
      .isWindowVisible().should.eventually.be.true
      .isWindowFocused().should.eventually.be.true
      .getWindowWidth().should.eventually.equal(920)
      .getWindowHeight().should.eventually.equal(900)
      .getTitle().should.eventually.equal('Electron API Demos')
      .isVisible('#about-view').should.eventually.be.true
      .isVisible('#index-view').should.eventually.be.true;
  });

  describe('when clicking on a section from the nav bar', function () {
    it('shows the selected section in the main area', function () {
      return this.app.client.waitUntilWindowLoaded()
        .isVisible('#about-view').should.eventually.be.true
        .click('button[data-view="windows"]')
        .waitForVisible('#windows-view')
        .isExisting('button.is-selected[data-view="windows"]').should.eventually.be.true
        .isVisible('#pdf-view').should.eventually.be.false
        .click('button[data-view="pdf"]')
        .waitForVisible('#pdf-view')
        .isVisible('#windows-view').should.eventually.be.false
        .isExisting('button.is-selected[data-view="windows"]').should.eventually.be.false
        .isExisting('button.is-selected[data-view="pdf"]').should.eventually.be.true;
    });
  });

  describe('when a task is clicked', function () {
    it('it expands', function () {
      var onlyFirstVisible = Array(20).fill(false);
      onlyFirstVisible[0] = true;

      return this.app.client.waitUntilWindowLoaded()
        .click('button[data-view="windows"]')
        .waitForVisible('#windows-view')
        .click('.js-container-target')
        .waitForVisible('.toggle-content')
        .isVisible('.toggle-content').should.eventually.deep.equal(onlyFirstVisible);
    });
  });
});
