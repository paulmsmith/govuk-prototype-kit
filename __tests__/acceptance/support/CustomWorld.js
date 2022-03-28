const { World, Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber')
const puppeteer = require('puppeteer')

class CustomWorld extends World {

  browser = undefined
  browserPath = undefined

  testDir = undefined

  constructor (options) {
    super(options)
  }
}

const setupBrowser = async (context) => {
  if (!context.browser) {
    console.log('Setting up browser')
    var browserOptions = {
      headless: false, // FIXME: downloads should work in headless mode?
      product: 'chrome',
      defaultViewport: null,
      devtools: true,
      slowMo: undefined, // slow down by specified ms so we can view in headful mode
      args: [
        `--window-size=1024,768`
      ]
    }

    if (context.browserPath !== '') {
      delete browserOptions.product;
      browserOptions.executablePath = this.browserPath;
    } else if (browserName === 'edge') {
      delete browserOptions.product;
      browserOptions.executablePath = edgePath;
    }

    context.browser =  await puppeteer.launch(browserOptions);
  }
}

const teardownBrowser = async function (context) {
  if (context.browser) {
    await context.browser.close()
  }
}

CustomWorld.setup = function () {
  BeforeAll(async function () {
    return Promise.resolve()
  })
  Before(async function (scenario) {
    await setupBrowser(this)
    return Promise.resolve()
  })
  After(async function (scenario) {
    await teardownBrowser(this)
    return Promise.resolve()
  })
  AfterAll(async function () {
    return Promise.resolve()
  })
}

module.exports = CustomWorld
