var Application = require('spectron').Application
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var path = require('path')

chai.should()
chai.use(chaiAsPromised)

describe('application launch', function () {
  this.timeout(30000)

  beforeEach(function () {
    this.app = new Application({
      path: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
      args: [
        path.join(__dirname, '..')
      ]
    })
    return this.app.start()
  })

  beforeEach(function () {
    chaiAsPromised.transferPromiseness = this.app.client.transferPromiseness
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('opens a window', function () {
    return this.app.client.waitUntilWindowLoaded()
      .getWindowCount().should.eventually.equal(1)
      .isWindowMinimized().should.eventually.be.false
      .isWindowDevToolsOpened().should.eventually.be.false
      .isWindowVisible().should.eventually.be.true
      .isWindowFocused().should.eventually.be.true
      .getWindowWidth().should.eventually.equal(800)
      .getWindowHeight().should.eventually.equal(900)
      .getTitle().should.eventually.equal('Electron API Demos')
      .getText('.foo')
      .getHTML('')
  })

  it('opens the system dialogs section', function () {
    return this.app.client.waitUntilWindowLoaded()
      .click('a.system-dialogs')
      .click('a.system-dialogs')
      .waitUntil(function() {
        return this.getUrl().then(function(url) {
          return url.indexOf('dialogs.html') !== -1
        });
      });
      // .waitForVisible('.task-page', 10000)
      // .getText('h1').should.eventually.equal('Use system dialogs')
  })
})
