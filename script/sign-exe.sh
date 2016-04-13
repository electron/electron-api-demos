#!/usr/bin/env bash

set -ex

osslsigncode \
  -spc ~/electron-api-demos.spc \
  -key ~/electron-api-demos.key \
  -h sha1 \
  -n 'Electron API Demos' \
  -i http://electron.atom.io  \
  -t http://timestamp.verisign.com/scripts/timstamp.dll \
  -in './out/ElectronAPIDemos-win32-ia32/ElectronAPIDemos.exe' \
  -out './out/ElectronAPIDemos-win32-ia32/ElectronAPIDemosSigned.exe'

rm -fr ./out/ElectronAPIDemos-win32-ia32/ElectronAPIDemos.exe
mv ./out/ElectronAPIDemos-win32-ia32/ElectronAPIDemosSigned.exe ./out/ElectronAPIDemos-win32-ia32/ElectronAPIDemos.exe

osslsigncode \
  -spc ~/electron-api-demos.spc \
  -key ~/electron-api-demos.key \
  -h sha256 \
  -n 'Electron API Demos' \
  -i http://electron.atom.io  \
  -t http://timestamp.verisign.com/scripts/timstamp.dll \
  -nest \
  -in './out/ElectronAPIDemos-win32-ia32/ElectronAPIDemos.exe' \
  -out './out/ElectronAPIDemos-win32-ia32/ElectronAPIDemosSigned.exe'

rm -fr ./out/ElectronAPIDemos-win32-ia32/ElectronAPIDemos.exe
mv ./out/ElectronAPIDemos-win32-ia32/ElectronAPIDemosSigned.exe ./out/ElectronAPIDemos-win32-ia32/ElectronAPIDemos.exe
