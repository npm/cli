#!/usr/bin/env bash

if [[ $DEBUG != "" ]]; then
  set -x
fi
set -o errexit
set -o pipefail

src=$1
dest=$2
name=$(basename ${src%.*})
date=$(date -u +'%Y-%m-%d %H:%M:%S')
version=$(node bin/npm-cli.js -v)

mkdir -p $(dirname $dest)

man_replace_tokens () {
	sed "s|@VERSION@|$version|g" \
	| perl -p -e 's/(npm\\-)?([a-zA-Z\\\.\-]*)\(1\)/npm help \2/g' \
	| perl -p -e 's/(npm\\-)?([a-zA-Z\\\.\-]*)\(([57])\)/npm help \3 \2/g' \
	| perl -p -e 's/(npm\\-)?([a-zA-Z\\\.\-]*)\(3\)/npm apihelp \2/g' \
	| perl -p -e 's/npm\(1\)/npm help npm/g' \
	| perl -p -e 's/npm\(3\)/npm apihelp npm/g'
}

./node_modules/.bin/marked-man --roff $src \
| man_replace_tokens > $dest
