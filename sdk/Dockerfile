# SPDX-License-Identifier: GPL-3.0-or-later
#
# An OpenWrt release SDK image with build-package as its entrypoint. SDK_IMAGE is
# the SDK image the Build workflow passes from its matrix, pinned by digest, e.g.
# ghcr.io/openwrt/sdk:x86_64-24.10.8@sha256:<digest>
#
# The SDK images run as the user buildbot in /builder, where the SDK already is.
# build-package keeps that user and directory and never runs the image's setup.sh.
ARG SDK_IMAGE

# hadolint never resolves ARG values, so DL3006 cannot see the tag@sha256 the
# workflow passes in SDK_IMAGE
# hadolint ignore=DL3006
FROM ${SDK_IMAGE}

LABEL org.opencontainers.image.description='OpenWrt SDK that builds one package of a mounted feed' \
      org.opencontainers.image.licenses='GPL-3.0-or-later' \
      org.opencontainers.image.source='https://github.com/sscheib/openwrt-molecule-package'

COPY --chmod=0755 build-package.sh /usr/local/bin/build-package

ENTRYPOINT ["/usr/local/bin/build-package"]

# the SDK image's shell-form CMD would otherwise become build-package's arguments
CMD []
