const fs = require('fs/promises')
const path = require('path')

const { Given, When, Then, setWorldConstructor } = require('@cucumber/cucumber')
const CustomWorld = require('../support/CustomWorld')
const useTestDirectories = require('../support/testDirectories')

setWorldConstructor(CustomWorld)

CustomWorld.setup()
useTestDirectories()

function clickAndWait (page, selector) {
  return Promise.all([
    page.click(selector),
    page.waitForNavigation({
      waitUntil: 'networkidle0'
    })
  ])
}

Given('I am on the install page', async function () {
  this.page = await this.browser.newPage()
  await this.page.goto('https://govuk-prototype-kit.herokuapp.com/docs/install', {
    waitUntil: 'networkidle0'
  })
})

When('I click the download link', async function () {
  // configure the downloads folder
  this.downloadsDir = path.join(this.testDir, 'Downloads')
  await fs.mkdir(this.downloadsDir, { recursive: true })
  const client = await this.page.target().createCDPSession()
  await client.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: this.downloadsDir })
  await this.page.click('[data-link="download"]')
})

When('the download is complete', async function () {
  // A simple `waitUntil: networkidle?` doesn't work here
  // For now just use a naive timeout
  await this.page.waitForTimeout(2000)
})

Then('I should have the latest release archive in my downloads folder', async function () {
  await fs.access(`${this.downloadsDir}/govuk-prototype-kit-12.0.1.zip`)
})

Given('I have downloaded the prototype kit', async function () {
  // Magically put the release archive in the downloads folder
})

Given('I am on the correct version of nodejs', function () {
  // Write code here that turns the phrase above into concrete actions
  // console.log('Step I am on the correct version of nodejs', this.status)
})
Given('I have installed the dependencies', function () {
  // console.log('Step I have installed the dependencies', this.status)
})

When('I run the kit', function () {
  // console.log('Step I run the kit', this.status)
})

Then('I should be able to access it on http:\\/\\/localhost:{int}\\/', function (int) {
  // console.log('Step I should be able to access it on http:\\/\\/localhost:{int}\\/', this.status)
})

Given('I set the port to {int}', function (int) {
})
