// jshint esversion: 6
// semantic-release configuration, run by the release job of the Build workflow.
// The commit-analyzer derives the next version from the Conventional Commits on
// main, the exec plugin writes it into the package Makefile and the git plugin
// commits that together with the change log. The github plugin attaches the two
// packages the build jobs made for exactly that version.
module.exports = {
  branches: [
    {
      name: 'main',
      prerelease: false,
    },
  ],
  plugins: [
    // the conventionalcommits preset reads `feat!:` and `fix!:` as breaking changes,
    // the default angular preset releases nothing for them
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
        changelogTitle: '# Change log',
      },
    ],
    [
      '@semantic-release/exec',
      {
        // the build job applies the same edit before it builds the packages
        prepareCmd: 'sed -i -E ' +
          '-e "s/^PKG_VERSION:=.*/PKG_VERSION:=${nextRelease.version}/" ' +
          '-e "s/^PKG_RELEASE:=.*/PKG_RELEASE:=1/" ' +
          'openwrt-molecule-package/Makefile',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          'CHANGELOG.md',
          'openwrt-molecule-package/Makefile',
        ],
        message: 'chore(release): Create release <%= nextRelease.version %>\n\n' +
          'Signed-off-by: semantic-release-bot <semantic-release-bot@martynus.net>',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: 'dist/*.ipk',
          },
          {
            path: 'dist/*.apk',
          },
          {
            path: 'CHANGELOG.md',
            label: 'CHANGELOG.md',
          },
        ],
        assignees: [
          'sscheib',
        ],
      },
    ],
  ],
};
