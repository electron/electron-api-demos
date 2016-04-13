#!/usr/bin/env bash

set -ex

EXE_PATH=./out/ElectronAPIDemos-win32-ia32/ElectronAPIDemos.exe
SIGNED_EXE_PATH=./out/ElectronAPIDemos-win32-ia32/ElectronAPIDemosSigned.exe

osslsigncode \
  -spc ~/electron-api-demos.spc \
  -key ~/electron-api-demos.key \
  -h sha1 \
  -n 'Electron API Demos' \
  -i http://electron.atom.io  \
  -t http://timestamp.verisign.com/scripts/timstamp.dll \
  -in "$EXE_PATH" \
  -out "$SIGNED_EXE_PATH"

mv "$SIGNED_EXE_PATH" "$EXE_PATH"

osslsigncode \
  -spc ~/electron-api-demos.spc \
  -key ~/electron-api-demos.key \
  -h sha256 \
  -n 'Electron API Demos' \
  -i http://electron.atom.io  \
  -t http://timestamp.verisign.com/scripts/timstamp.dll \
  -nest \
  -in "$EXE_PATH" \
  -out "$SIGNED_EXE_PATH"

mv "$SIGNED_EXE_PATH" "$EXE_PATH"
