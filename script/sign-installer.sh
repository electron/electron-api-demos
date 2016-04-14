#!/usr/bin/env bash

set -ex

INSTALLER_PATH=./out/windows-installer/ElectronAPIDemosSetup.exe
SIGNED_INSTALLER_PATH=./out/windows-installer/ElectronAPIDemosSetupSigned.exe

osslsigncode \
  -spc ~/electron-api-demos.spc \
  -key ~/electron-api-demos.key \
  -h sha1 \
  -n 'Electron API Demos' \
  -i http://electron.atom.io  \
  -t http://timestamp.verisign.com/scripts/timstamp.dll \
  -in "$INSTALLER_PATH" \
  -out "$SIGNED_INSTALLER_PATH"

mv "$SIGNED_INSTALLER_PATH" "$INSTALLER_PATH"

osslsigncode \
  -spc ~/electron-api-demos.spc \
  -key ~/electron-api-demos.key \
  -h sha256 \
  -n 'Electron API Demos' \
  -i http://electron.atom.io  \
  -t http://timestamp.verisign.com/scripts/timstamp.dll \
  -nest \
  -in "$INSTALLER_PATH"\
  -out "$SIGNED_INSTALLER_PATH"

mv "$SIGNED_INSTALLER_PATH" "$INSTALLER_PATH"
