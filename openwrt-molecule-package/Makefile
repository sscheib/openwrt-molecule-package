# SPDX-License-Identifier: GPL-3.0-or-later
#
# The release asset the sscheib.openwrt molecule tests install. It ships one marker
# file and declares no dependencies of its own (package.mk adds libc, which every
# image ships), so it installs on every OpenWrt release whatever its base packages
# are. PKGARCH:=all makes one build install on every target, which is why CI needs
# only one SDK per package format.
#
# CI reads PKG_NAME, PKG_VERSION and PKG_RELEASE literally to name the release
# assets and to check the release tag, so keep them plain assignments.

include $(TOPDIR)/rules.mk

PKG_NAME:=openwrt-molecule-package
PKG_VERSION:=1.0.0
PKG_RELEASE:=1

PKG_MAINTAINER:=Steffen Scheib <steffen@scheib.me>
PKG_LICENSE:=GPL-3.0-or-later

include $(INCLUDE_DIR)/package.mk

define Package/openwrt-molecule-package
  SECTION:=utils
  CATEGORY:=Utilities
  TITLE:=Release asset the sscheib.openwrt molecule tests install
  URL:=https://github.com/sscheib/openwrt-molecule-package
  PKGARCH:=all
endef

define Package/openwrt-molecule-package/description
  Installs /usr/share/openwrt-molecule-package/marker and nothing else. The
  molecule tests of the sscheib.openwrt collection install the latest release
  of this package.
endef

# nothing to compile, the package only installs a file
define Build/Compile
endef

define Package/openwrt-molecule-package/install
	$(INSTALL_DIR) $(1)/usr/share/openwrt-molecule-package
	$(INSTALL_DATA) ./files/marker $(1)/usr/share/openwrt-molecule-package/marker
endef

$(eval $(call BuildPackage,openwrt-molecule-package))
