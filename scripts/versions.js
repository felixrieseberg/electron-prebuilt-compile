const { execSync } = require('child_process')

/**
 * Is the passed version older than 2.0.0?
 *
 * @param {string} [version='']
 * @returns {boolean}
 */
function isAncientVersion(version = '') {
  const asNumber = parseInt(version[0], 10) || 0
  return asNumber < 2
}

/**
 * Pass in a package name, get released versions as array.
 * Requires npm on the system.
 *
 * @param {string} packageName
 * @returns {Array<string>}
 */
function getVersions(packageName) {
  const result = execSync(`npm info ${packageName} --json`)

  try {
    return JSON.parse(result).versions
  } catch (error) {
    console.warn(`Could not successfully run "${result}"`)

    throw error
  }
}

/**
 * Get the versions for which we need to release electron-prebuilt-compile
 *
 * @returns {Array<string>}
 */
function getVersionsToRelease() {
  const electronVersions = getVersions('electron')
  const prebuiltVersions = getVersions('@felixrieseberg/electron-prebuilt-compile')
  const versionsToRelease = electronVersions
    .filter((version) => !prebuiltVersions.includes(version))
    .filter((version) => !isAncientVersion(version))

  return versionsToRelease
}

module.exports = {
  getVersionsToRelease
}
