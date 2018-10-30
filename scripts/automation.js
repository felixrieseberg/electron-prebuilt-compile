const { getVersionsToRelease } = require('./versions')
const { releaseVersions } = require('./release')

const versionsToRelease = getVersionsToRelease()
console.log(`We'll release the following versions:\n  - ${versionsToRelease.join('\n  - ')}\n`)

releaseVersions(versionsToRelease)
