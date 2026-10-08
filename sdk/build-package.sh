#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
#
# Builds one package with the OpenWrt SDK that ships in the image and copies the
# built package files to the output directory.
#
#   build-package <package>
#
# The feed is mounted read-only at FEED_DIR (default /feed) with the package in
# FEED_DIR/<package>, the output directory is mounted writable at OUT_DIR (default
# /out). V sets the make verbosity (e.g. V=s).
#
# Adapted from the entrypoint of openwrt/gh-action-sdk v11. Unlike it, this never
# runs setup.sh: a release SDK image already holds the SDK in /builder and its
# leftover setup.sh only downloads the SDK tarball again. Signing, the package
# index and the patch refresh and init script format checks are left out, this
# repository uses none of them.

# fail if:
# - a variable is unbound
# - any command fails
# - a command in a pipe fails
# - a command in a sub-shell fails
set -Eeuo pipefail

declare -r package="${1:?usage: build-package <package>}"
declare -r feedName='action'
declare -r feedDir="${FEED_DIR:-/feed}"
declare -r outDir="${OUT_DIR:-/out}"
declare -r sdkDir="${SDK_DIR:-/builder}"
declare -r verbosity="${V:-}"

# collapsible sections in the GitHub Actions log, harmless anywhere else
group() {
  echo "::group::${1}"
}

endgroup() {
  echo '::endgroup::'
}

[[ -f "${feedDir}/${package}/Makefile" ]] || {
  echo "ERROR: ${feedDir}/${package}/Makefile does not exist, is the feed mounted?" >&2;
  exit 1;
};

[[ -d "${outDir}" && -w "${outDir}" ]] || {
  echo "ERROR: ${outDir} is not a writable directory, is it mounted?" >&2;
  exit 1;
};

cd "${sdkDir}"

# only our feed: the package depends on nothing but libc, which the SDK toolchain
# provides, so the default feeds would only cost a clone of each of them
group 'feeds.conf'
echo "src-link ${feedName} ${feedDir}" > feeds.conf
cat feeds.conf
endgroup

group "feeds update ${feedName}"
./scripts/feeds update "${feedName}"
endgroup

group "feeds install ${package}"
./scripts/feeds install -p "${feedName}" -f "${package}"
endgroup

group 'make defconfig'
make defconfig
endgroup

group "make package/${package}/download"
make "package/${package}/download" V=s
endgroup

# the SDK's package checks, the hash check reads their output
checkLog="$(mktemp)"
group "make package/${package}/check"
make "package/${package}/check" V=s 2>&1 | tee "${checkLog}"
endgroup

if grep -qE 'HASH does not match |HASH uses deprecated hash,|HASH is missing,' "${checkLog}"; then
  echo "ERROR: the package hash check failed" >&2
  exit 1
fi

# a package the target does not enable compiles to nothing without an error, so
# fail here rather than later on a missing file
enabledPackages="$(make \
  -f .config \
  -f tmp/.packagedeps \
  -f <(echo "\$(info \$(sort \$(package-y) \$(package-m)))"; printf 'a:\n\t@:\n') \
  | tr ' ' '\n')"

grep -qE "(^|/)${package}$" <<< "${enabledPackages}" || {
  echo "ERROR: ${package} is not enabled for this SDK's target" >&2;
  exit 1;
};

jobCount="$(nproc)"
group "make package/${package}/compile"
make "package/${package}/compile" V="${verbosity}" -j "${jobCount}"
endgroup

# ipk: <package>_<version>_<arch>.ipk, apk: <package>-<version>.apk
packageFiles="$(find bin/packages -type f \( -name "${package}_*.ipk" -o -name "${package}-*.apk" \))"
mapfile -t built <<< "${packageFiles}"

[[ -n "${packageFiles}" ]] || {
  echo "ERROR: the SDK built no package file for ${package}" >&2;
  exit 1;
};

cp "${built[@]}" "${outDir}/"
printf 'INFO: built %s\n' "${built[@]}"
