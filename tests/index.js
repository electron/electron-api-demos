var Application = require('spectron').Application
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var path = require('path')

chai.should()
chai.use(chaiAsPromised)

describe('application launch', function () {
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
      .getWindowWidth().should.eventually.be.above(0)
      .getWindowHeight().should.eventually.be.above(0)
  })
})
