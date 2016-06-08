'use strict'

const Application = require('spectron').Application
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const path = require('path')
const fs = require('fs')

chai.should()
chai.use(chaiAsPromised)

describe('demo app', function () {
  this.timeout(30000)

  let app

  const removeStoredPreferences = function () {
    const productName = require('../package').productName
    const userDataPath = path.join(process.env.HOME, 'Library', 'Application Support', productName)
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

  const setupApp = function (app) {
    chaiAsPromised.transferPromiseness = app.transferPromiseness
    return app.client.waitUntilWindowLoaded()
  }

  const startApp = function () {
    app = new Application({
      path: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
      args: [
        path.join(__dirname, '..')
      ],
      waitTimeout: 10000
    })

    return app.start().then(setupApp)
  }

  const restartApp = function () {
    return app.restart().then(setupApp)
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
      .browserWindow.isMinimized().should.eventually.be.false
      .browserWindow.isDevToolsOpened().should.eventually.be.false
      .browserWindow.isVisible().should.eventually.be.true
      .browserWindow.isFocused().should.eventually.be.true
      .browserWindow.getBounds().should.eventually.have.property('width').and.be.above(0)
      .browserWindow.getBounds().should.eventually.have.property('height').and.be.above(0)
      .browserWindow.getTitle().should.eventually.equal('Electron API Demos')
      .waitForVisible('#about-modal').should.eventually.be.true
      .isVisible('.js-nav').should.eventually.be.false
      .click('button[id="get-started"]').pause(500)
      .isVisible('#about-modal').should.eventually.be.false
      .isVisible('.js-nav').should.eventually.be.true
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
      let onlyFirstVisible = Array(27).fill(false)
      onlyFirstVisible[0] = true

      return app.client.click('button[data-section="windows"]')
        .waitForVisible('#windows-section')
        .click('.js-container-target')
        .waitForVisible('.demo-box')
        .isVisible('.demo-box').should.eventually.deep.equal(onlyFirstVisible)
    })
  })

  describe('when the app is restarted after use', function () {
    it('it launches at last visted section & demo', function () {
      let onlyFirstVisible = Array(27).fill(false)
      onlyFirstVisible[0] = true

      return app.client.waitForVisible('#windows-section')
        .then(restartApp)
        .then(function () {
          return app.client.waitForVisible('#windows-section')
            .isVisible('#windows-section').should.eventually.be.true
            .isVisible('.demo-box').should.eventually.deep.equal(onlyFirstVisible)
        })
    })
  })
})
