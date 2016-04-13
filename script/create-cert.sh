#!/usr/bin/env bash

set -ex

rm -f ~/electron-api-demos-key.pem
rm -f ~/electron-api-demos-cert.pem
rm -f ~/electron-api-demos.key
rm -f ~/electron-api-demos.spc

openssl pkcs12 -in "$1" -nocerts -nodes -out ~/electron-api-demos-key.pem
openssl pkcs12 -in "$1" -nokeys -nodes -out ~/electron-api-demos-cert.pem
openssl rsa -des3 -in ~/electron-api-demos-key.pem -out ~/electron-api-demos.key
openssl crl2pkcs7 -nocrl -certfile ~/electron-api-demos-cert.pem -outform DER -out ~/electron-api-demos.spc

rm -f ~/electron-api-demos-key.pem
rm -f ~/electron-api-demos-cert.pem
