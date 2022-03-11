const { Given, When, Then, setWorldConstructor, Before } = require('@cucumber/cucumber')
const CustomWorld = require('../support/CustomWorld')

setWorldConstructor(CustomWorld)

CustomWorld.setup()

Given('I have downloaded the prototype kit', async function () {
  // visit https://govuk-prototype-kit.herokuapp.com/docs
  // click install
  // click Download the Prototype Kit (zip file)
  console.log('Step I have downloaded the prototype kit', this.status)
})

Given('I am on the correct version of nodejs', function () {
  // Write code here that turns the phrase above into concrete actions
  console.log('Step I am on the correct version of nodejs', this.status)
})
Given('I have installed the dependencies', function () {
  console.log('Step I have installed the dependencies', this.status)
})

When('I run the kit', function () {
  console.log('Step I run the kit', this.status)
})

Then('I should be able to access it on http:\\/\\/localhost:{int}\\/', function (int) {
  console.log('Step I should be able to access it on http:\\/\\/localhost:{int}\\/', this.status)
})

Given('I set the port to {int}', function (int) {
})
