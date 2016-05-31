#!/bin/bash

set -ex

electron-packager . \
  --asar \
  --overwrite \
  --platform=mas \
  --app-bundle-id=com.github.electron-api-demos \
  --arch=x64 \
  --icon=assets/app-icon/mac/app.icns \
  --prune=true \
  --out=out \
  --extend-info=assets/mac/info.plist

# Name of your app.
APP="Electron API Demos"

# The path of your app to sign.
APP_PATH="./out/Electron API Demos-mas-x64/Electron API Demos.app"

# The path to the location you want to put the signed package.
RESULT_PATH="./out/Electron API Demos.pkg"

# The name of certificates you requested.
APP_KEY="3rd Party Mac Developer Application: GitHub (VEKTX9H2N7)"
INSTALLER_KEY="3rd Party Mac Developer Installer: GitHub (VEKTX9H2N7)"

FRAMEWORKS_PATH="$APP_PATH/Contents/Frameworks"

CHILD_PLIST="./assets/mac/child.plist"
PARENT_PLIST="./assets/mac/parent.plist"

codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Electron Framework"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libnode.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper.app/Contents/MacOS/$APP Helper"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper.app/"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper EH.app/Contents/MacOS/$APP Helper EH"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper EH.app/"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper NP.app/Contents/MacOS/$APP Helper NP"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper NP.app/"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$APP_PATH/Contents/MacOS/$APP"

codesign -s "$APP_KEY" -f --entitlements "$PARENT_PLIST" "$APP_PATH"

productbuild --component "$APP_PATH" /Applications --sign "$INSTALLER_KEY" "$RESULT_PATH"
