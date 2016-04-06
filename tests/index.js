var Application = require('spectron').Application
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var path = require('path')
var fs = require('fs')

chai.should()
chai.use(chaiAsPromised)

var after = global.after
var before = global.before
var describe = global.describe
var it = global.it

describe('demo app', function () {
  this.timeout(30000)

  var app

  var removeStoredPreferences = function () {
    var userDataPath = path.join(process.env.HOME, 'Library', 'Application Support', 'electron-api-demos')
    try {
      fs.unlinkSync(path.join(userDataPath, 'activeDemoButtonId.json'))
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    try {
      fs.unlinkSync(path.join(userDataPath, 'activeSectionButtonId.json'))
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }

  var startApp = function () {
    app = new Application({
      path: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
      args: [
        path.join(__dirname, '..')
      ],
      waitTimeout: 10000
    })

    return app.start().then(function () {
      chaiAsPromised.transferPromiseness = app.client.transferPromiseness
    }).then(function () {
      return app.client.waitUntilWindowLoaded()
    })
  }

  var restartApp = function () {
    return app.stop().then(function () {
      return startApp()
    })
  }

  before(function () {
    removeStoredPreferences()
    return startApp()
  })

  after(function () {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  it('opens a window displaying the about page', function () {
    return app.client.getWindowCount().should.eventually.equal(1)
      .isWindowMinimized().should.eventually.be.false
      .isWindowDevToolsOpened().should.eventually.be.false
      .isWindowVisible().should.eventually.be.true
      .isWindowFocused().should.eventually.be.true
      .getWindowWidth().should.eventually.be.above(0)
      .getWindowHeight().should.eventually.be.above(0)
      .getTitle().should.eventually.equal('Electron API Demos')
      .waitForVisible('#about-modal').should.eventually.be.true
      .isVisible('.section-nav').should.eventually.be.false
      .click('button[id="get-started"]').pause(500)
      .isVisible('#about-modal').should.eventually.be.false
      .isVisible('.section-nav').should.eventually.be.true
  })

  describe('when clicking on a section from the nav bar', function () {
    it('it shows the selected section in the main area', function () {
      return app.client.isVisible('#windows-section').should.eventually.be.true
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

  describe('when a demo title is clicked', function () {
    it('it expands the demo content', function () {
      var onlyFirstVisible = Array(21).fill(false)
      onlyFirstVisible[0] = true

      return app.client.click('button[data-section="windows"]')
        .waitForVisible('#windows-section')
        .click('.js-container-target')
        .waitForVisible('.toggle-content')
        .isVisible('.toggle-content').should.eventually.deep.equal(onlyFirstVisible)
    })
  })

  describe('when the app is restarted after use', function () {
    it('it launches at last visted section & demo', function () {
      var onlyFirstVisible = Array(21).fill(false)
      onlyFirstVisible[0] = true

      return app.client.waitForVisible('#windows-section')
        .then(restartApp)
        .then(function () {
          return app.client.waitForVisible('#windows-section')
            .isVisible('#windows-section').should.eventually.be.true
            .isVisible('.toggle-content').should.eventually.deep.equal(onlyFirstVisible)
        })
    })
  })
})
