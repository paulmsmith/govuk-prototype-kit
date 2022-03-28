const fs = require('fs/promises')
const os = require('os')
const path = require('path')

const { BeforeAll, Before, AfterAll } = require('@cucumber/cucumber')

const useTestDirectories = function () {
  BeforeAll(async function () {
    global.tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cucumber-'))
    global.oldCwd = process.cwd()
    process.chdir(global.tmpDir)
    console.log(`Running tests in ${process.cwd()}`)
  })

  Before(async function (scenario) {
    const featureName = path.basename(scenario.pickle.uri, '.feature')
    const scenarioName = scenario.pickle.name.replaceAll(' ', '_')
    this.testDir = path.join(global.tmpDir, `${featureName}-${scenarioName}`)
  })

  AfterAll(async function () {
    process.chdir(global.oldCwd)
  })
}

module.exports = useTestDirectories
