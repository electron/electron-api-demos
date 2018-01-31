'use strict'

const path = require('path')
const fs = require('fs')
const chaiAsPromised = require('chai-as-promised')

const getUserDataPath = function () {
  const productName = require('../package').productName
  switch (process.platform) {
    case 'darwin':
      return path.join(process.env.HOME, 'Library', 'Application Support', productName)
    case 'win32':
      return path.join(process.env.APPDATA, productName)
    case 'freebsd':
    case 'linux':
    case 'sunos':
      return path.join(process.env.HOME, '.config', productName)
    default:
      throw new Error(`Unknown userDataPath path for platform ${process.platform}`)
  }
}

const removeStoredPreferences = () => {
  const userDataPath = getUserDataPath()
  try {
    fs.unlinkSync(path.join(userDataPath, 'Settings'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
}

const setupApp = function (app) {
  app.client.addCommand('dismissAboutPage', function () {
    return this.isVisible('.js-nav').then(function (navVisible) {
      if (!navVisible) {
        return this.click('button[id="get-started"]').pause(500)
      }
    })
  })

  app.client.addCommand('selectSection', function (section) {
    return this.click('button[data-section="' + section + '"]').pause(100)
      .waitForVisible('#' + section + '-section')
  })

  app.client.addCommand('expandDemos', function () {
    return this.execute(function () {
      for (let demo of document.querySelectorAll('.demo-wrapper')) {
        demo.classList.add('is-open')
      }
    })
  })

  app.client.addCommand('collapseDemos', function () {
    return this.execute(function () {
      for (let demo of document.querySelectorAll('.demo-wrapper')) {
        demo.classList.remove('is-open')
      }
    })
  })

  app.client.addCommand('auditSectionAccessibility', function (section) {
    const options = {
      ignoreRules: ['AX_COLOR_01', 'AX_TITLE_01']
    }
    return this.selectSection(section)
      .expandDemos()
      .auditAccessibility(options).then(function (audit) {
        if (audit.failed) {
          throw Error(section + ' section failed accessibility audit\n' + audit.message)
        }
      })
  })

  chaiAsPromised.transferPromiseness = app.transferPromiseness
  return app.client.waitUntilWindowLoaded()
}

module.exports = {
  removeStoredPreferences,
  getUserDataPath,
  setupApp
}
