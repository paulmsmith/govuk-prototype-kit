const { World, Before, After } = require('@cucumber/cucumber')
const puppeteer = require('puppeteer')

class CustomWorld extends World {
  constructor (options) {
    super(options)

    this.browser = undefined
    this.browserPath = undefined

    this.testDir = undefined
  }
}

const setupBrowser = async (context) => {
  if (!context.browser) {
    var browserOptions = {
      headless: true,
      product: 'chrome',
      defaultViewport: null,
      devtools: true,
      slowMo: undefined, // slow down by specified ms so we can view in headful mode
      args: [
        '--window-size=1024,768'
      ]
    }

    if (context.browserPath !== '') {
      delete browserOptions.product
      browserOptions.executablePath = this.browserPath
    }

    context.browser = await puppeteer.launch(browserOptions)
  }
}

const teardownBrowser = async function (context) {
  if (context.browser) {
    await context.browser.close()
  }
}

CustomWorld.setup = function () {
  Before('@browser', async function (scenario) {
    await setupBrowser(this)
  })
  After('@browser', async function (scenario) {
    await teardownBrowser(this)
  })
}

module.exports = CustomWorld
