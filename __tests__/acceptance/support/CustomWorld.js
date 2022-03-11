const { World, Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber')

class CustomWorld extends World {
  status = 'base'

  constructor (options) {
    super(options)
    this.status = 'constructor'
  }
}

CustomWorld.setup = function () {
  BeforeAll(async function () {
    console.log('init')
    this.status = 'init'
    return Promise.resolve()
  })
  Before(async function () {
    console.log('reset before feature')
    this.status = 'reset before feature'
    return Promise.resolve()
  })
  After(async function () {
    console.log('reset after feature')
    this.status = 'reset after feature'
    return Promise.resolve()
  })
  AfterAll(async function () {
    console.log('teardown after all')
    this.status = 'teardown after all'
    return Promise.resolve()
  })
}

module.exports = CustomWorld
