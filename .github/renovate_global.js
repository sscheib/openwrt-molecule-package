// jshint esversion: 6
// Global (self-hosted) Renovate configuration the Renovate workflow passes as its
// configurationFile. The repository configuration lives in .github/renovate.json5.
module.exports = {
  // registered as secrets so Renovate masks the token in its logs
  secrets: {
    GHCR_TOKEN: process.env.RENOVATE_GHCR_TOKEN,
    GHCR_USERNAME: process.env.RENOVATE_GHCR_USERNAME,
  },
  gitAuthor: 'Renovate <renovate@scheib.me>',
  hostRules: [
    {
      // authenticated ghcr.io lookups (the OpenWrt SDK, Renovate and gitleaks
      // images) with the workflow's GITHUB_TOKEN
      matchHost: 'ghcr.io',
      username: '{{ secrets.GHCR_USERNAME }}',
      password: '{{ secrets.GHCR_TOKEN }}',
    },
    {
      // the npm registry is slow to answer large packuments
      matchHost: 'registry.npmjs.org',
      timeout: 240000,
      enableHttp2: false,
    },
  ],
};
