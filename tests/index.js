var Application = require('spectron').Application
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var path = require('path')

chai.should()
chai.use(chaiAsPromised)

var after = global.after
var before = global.before
var describe = global.describe
var it = global.it

describe('demo app', function () {
  this.timeout(30000)

  before(function () {
    this.app = new Application({
      path: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
      args: [
        path.join(__dirname, '..')
      ],
      waitTimeout: 10000
    })
    return this.app.start()
  })

  before(function () {
    chaiAsPromised.transferPromiseness = this.app.client.transferPromiseness
  })

  after(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('opens a window displaying the about page and nav bar', function () {
    return this.app.client.waitUntilWindowLoaded()
      .getWindowCount().should.eventually.equal(1)
      .isWindowMinimized().should.eventually.be.false
      .isWindowDevToolsOpened().should.eventually.be.false
      .isWindowVisible().should.eventually.be.true
      .isWindowFocused().should.eventually.be.true
      .getWindowWidth().should.eventually.be.above(0)
      .getWindowHeight().should.eventually.be.above(0)
      .getTitle().should.eventually.equal('Electron API Demos')
      .isVisible('#about-section').should.eventually.be.true
      .isVisible('#section-nav').should.eventually.be.true
      .click('button[id="get-started"]').pause(100)
  })

  describe('when clicking on a section from the nav bar', function () {
    it('shows the selected section in the main area', function () {
      return this.app.client.waitUntilWindowLoaded()
        .isVisible('#windows-section').should.eventually.be.true
        .click('button[data-section="windows"]').pause(100)
        .waitForVisible('#windows-section')
        .isExisting('button.is-selected[data-section="windows"]').should.eventually.be.true
        .isVisible('#pdf-section').should.eventually.be.false
        .click('button[data-section="pdf"]').pause(100)
        .waitForVisible('#pdf-section')
        .isVisible('#windows-section').should.eventually.be.false
        .isExisting('button.is-selected[data-section="windows"]').should.eventually.be.false
        .isExisting('button.is-selected[data-section="pdf"]').should.eventually.be.true
    })
  })

  describe('when a task is clicked', function () {
    it('it expands', function () {
      var onlyFirstVisible = Array(21).fill(false)
      onlyFirstVisible[0] = true

      return this.app.client.waitUntilWindowLoaded()
        .click('button[data-section="windows"]')
        .waitForVisible('#windows-section')
        .click('.js-container-target')
        .waitForVisible('.toggle-content')
        .isVisible('.toggle-content').should.eventually.deep.equal(onlyFirstVisible)
    })
  })
})
