# openwrt-molecule-package

A minimal OpenWrt package. The molecule tests of
[sscheib.openwrt](https://github.com/sscheib/ansible-collection-openwrt) install
its latest GitHub release.

## Why

The `package_file` role resolves the latest release of a repository when no
version is pinned. Testing that against a third-party project ties the result to
that project's next release. This repository only changes when the collection
needs it to.

## Package

| Asset | Package manager | OpenWrt |
| --- | --- | --- |
| `openwrt-molecule-package_<version>-r<release>_all.ipk` | opkg | 24.10 and older |
| `openwrt-molecule-package-<version>-r<release>.apk` | apk | 25.12 and newer |

It installs `/usr/share/openwrt-molecule-package/marker` and depends only on
`libc`, which every OpenWrt image ships. The apk is unsigned and needs
`--allow-untrusted`.

## Building

[`openwrt-molecule-package/Makefile`](openwrt-molecule-package/Makefile) is a
regular OpenWrt package. The `Build` workflow builds it with the official
[OpenWrt SDK action](https://github.com/openwrt/gh-action-sdk): the 24.10 SDK
writes the ipk and the 25.12 SDK writes the apk. Pull requests and `main` upload
both as workflow artifacts.

Releases are cut automatically from the Conventional Commits on `main`, there is
no manual tagging. [semantic-release](https://semantic-release.gitbook.io) picks
the next version (`fix` is a patch, `feat` a minor and `feat!`, `fix!` or a
`BREAKING CHANGE` footer a major release), the packages are built for it and the release commit updates
`PKG_VERSION` and `CHANGELOG.md` before the tag and the GitHub release with both
packages are created.

## Development

```sh
prek install --install-hooks
```

It installs the pre-commit and commit-msg hooks. They lint YAML, Markdown, the
workflows and the Renovate configuration, scan for secrets and typos and keep
every file ASCII. Commit messages follow Conventional Commits with a
`Signed-off-by` trailer.

The `CI` workflow runs the same checks. It copies the shared sscheib workflows
because those live in a private repository, which a public repository cannot call.

Renovate runs from the `Renovate` workflow every hour. It needs the repository
secret `RENOVATE_TOKEN`, a fine-grained personal access token with read and write
access to commit statuses, contents, issues, pull requests and workflows.

## License

[GPL-3.0-or-later](LICENSE)
