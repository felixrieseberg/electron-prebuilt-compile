const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const PACKAGE_ROOT = path.join(__dirname, '..')

/**
 * Update the package.json to a given version number
 *
 * @param {string} [version='']
 */
function updatePackageJson(version = '') {
  const packageJsonFile = fs.readFileSync(path.join(__dirname, '../package.json'))
  const packageJson = JSON.parse(packageJsonFile)

  packageJson.version = version
  packageJson.dependencies.electron = version

  const packageJsonUpdate = JSON.stringify(packageJson, undefined, 2)

  fs.writeFileSync(path.join(__dirname, '../package.json'), packageJsonUpdate)
}

/**
 * Run "npm install" in the package root
 */
function runNpmInstall(version = '') {
  console.log(`Now running "npm install"`)
  console.log(execSync('npm install --no-progress', { cwd: PACKAGE_ROOT }).toString())
}

/**
 * Run "npm publish" in the package root
 */
function runNpmPublish(version = '') {
  console.log(`Now running "npm publish"`)
  console.log(execSync('npm publish --dry-run', { cwd: PACKAGE_ROOT }).toString())
}

/**
 * Commit and push changes
 */
function runGit(version = '') {
  console.log(`Now running "git add"`)
  console.log(execSync(`git add .`, { cwd: PACKAGE_ROOT }).toString())
  console.log(`Now running "git commit"`)
  console.log(execSync(`git commit --dry-run -m "Update: Electron to ${version}"`, { cwd: PACKAGE_ROOT }).toString())
  console.log(`Now running "git push"`)
  console.log(execSync(`git push --dry-run`, { cwd: PACKAGE_ROOT }).toString())
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
