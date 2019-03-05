const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const PACKAGE_ROOT = path.resolve(__dirname, '..')
const EXEC_OTPS = { cwd: PACKAGE_ROOT }
const PACKAGE_JSON_FILENAME = path.join(PACKAGE_ROOT, 'package.json')

/**
 * Update the package.json to a given version number
 *
 * @param {string} [version='']
 */
function updatePackageJson(version = '') {
  const packageJsonFile = fs.readFileSync(PACKAGE_JSON_FILENAME)
  const packageJson = JSON.parse(packageJsonFile)

  packageJson.version = version
  packageJson.dependencies.electron = version

  const packageJsonUpdate = JSON.stringify(packageJson, undefined, 2)

  fs.writeFileSync(PACKAGE_JSON_FILENAME, packageJsonUpdate)
}

/**
 * Run "npm install" in the package root
 */
function runNpmInstall(version = '') {
  console.log(`Now running "npm install"`)
  console.log(execSync('npm install --no-progress --ignore-scripts', EXEC_OTPS).toString())
}

/**
 * Run "npm publish" in the package root
 */
function runNpmPublish(version = '') {
  console.log(`Now running "npm publish"`)
  console.log(execSync('npm publish', EXEC_OTPS).toString())
}

/**
 * Commit and push changes
 */
function runGit(version = '') {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO
  const remote = `https://${token}@github.com/${repo}.git`
  const branch = `master:master`

  console.log(`Now running "git add"`)
  console.log(execSync(`git add .`, EXEC_OTPS).toString())
  console.log(`Now running "git commit"`)
  console.log(execSync(`git commit -m "Update: Electron to ${version}"`, EXEC_OTPS).toString())
  console.log(`Now running "git push"`)
  console.log(execSync(`git push ${remote} ${branch}`, EXEC_OTPS).toString())
}

/**
 * Release versions of electron-prebuilt-compile
 *
 * @param {Array<string>} [versions=[]]
 */
function releaseVersions(versions = []) {
  versions.forEach((version) => {
    console.log(`------------------------------------------`)
    console.log(`#        Now releasing ${version}        #`)
    console.log(`------------------------------------------`)

    updatePackageJson(version)
    runNpmInstall(version)
    runNpmPublish(version)
    runGit(version)
  })
}

module.exports = {
  releaseVersions
}
