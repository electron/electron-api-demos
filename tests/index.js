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

var expect = chai.expect;

describe('demo app', function () {
  this.timeout(30000);

  beforeEach(function () {
    this.app = new Application({
      path: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
      args: [
        path.join(__dirname, '..')
      ]
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

  it('opens a window and lists the API sections', function () {
    return this.app.client.waitUntilWindowLoaded()
      .getWindowCount().should.eventually.equal(1)
      .isWindowMinimized().should.eventually.be.false
      .isWindowDevToolsOpened().should.eventually.be.false
      .isWindowVisible().should.eventually.be.true
      .isWindowFocused().should.eventually.be.true
      .getWindowWidth().should.eventually.equal(800)
      .getWindowHeight().should.eventually.equal(733)
      .getTitle().should.eventually.equal('Electron API Demos')
      .elements('section').then(function (response) {
        expect(response.status).to.equal(0);
        expect(response.value.length).to.equal(6);
      });
  });

  describe('when clicking on a section', function () {
    it('opens the selected section', function () {
      return this.app.client.waitUntilWindowLoaded()
        .click('a').pause(1000);
        .waitForVisible('.task-page', 10000);
        .getText('h1').should.eventually.equal('Use system dialogs');
    });
    it('all tasks are collapsed', function () {
      return this.app.client.isVisible('.toggle-content')
        .should.eventually.equal(false);
    });
  });
});
