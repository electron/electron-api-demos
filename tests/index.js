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
        .click('a').pause(1000)
        .waitForVisible('.task-page')
        .getText('h1').should.eventually.equal('Use system dialogs');
    });
    it('all tasks are collapsed', function () {
      return this.app.client
        .isVisible('.toggle-content').should.eventually.be.false;
    });
  });

  describe('when a task is clicked', function () {
    it('it expands', function () {
      return this.app.client.waitUntilWindowLoaded()
        .click('a').pause(1000)
        .waitForVisible('.task-page')
        .click('.js-container-target').pause(1000)
        .waitForVisible('.toggle-content')
        .isVisible('.toggle-content').should.eventually.deep.equal([ true, false, false, false ]);
    });
  });

  describe('when demo buttons are clicked', function () {
    it('uses Electron dialog api', function () {
      return this.app.client.waitUntilWindowLoaded()
        .execute(function () {
          require('electron').ipcRenderer.send('eval', (function () {
            require('electron').dialog.showOpenDialog = function () {
              global.showOpenDialogCalled = true;
              return '/a/b/c';
            };
          }).toString());
        })
        .click('a').pause(1000)
        .waitForVisible('.task-page')
        .click('.js-container-target').pause(1000)
        .waitForVisible('.toggle-content')
        .click('button').pause(1000)
        .waitUntil(function () {
          return this.execute(function () {
            return require('electron').remote.getGlobal('showOpenDialogCalled');
          }).then(function (response) {
            return response.value === true;
          });
        })
        .waitForText('#selected-file')
        .getText('#selected-file').should.eventually.equal('You selected: /a/b/c');
    });
  });
});
