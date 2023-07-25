#!/usr/bin/env bash

set -e

for f in $(find test/fixtures/registry-mocks/content -name "*.json" -not -name "*.min.json" | sort); do
  i=${f/test\/fixtures\/registry-mocks\/content\//}
  i=${i/\.json/}
  if [ $i != `basename $i` ]; then
    i=@$i
  fi
  echo $i
  curl -s https://registry.npmjs.org/$i | json > $f
  m=$(dirname "$f")/$(basename "$f" ".json").min.json
  node -e '
const mrm = require("minify-registry-metadata")
const f = require("./" + process.argv[1])
const m = process.argv[2]
const {writeFileSync} = require("fs")
writeFileSync(m, JSON.stringify(mrm(f), 0, 2) + "\n")
// also pluck off some particularly noisy bits from packuments.
for (const [v, manifest] of Object.entries(f.versions || {})) {
  delete manifest.licenseText
  delete manifest.readme
}
delete f.readme
delete f.licenseText
writeFileSync(process.argv[1], JSON.stringify(f, 0, 2) + "\n")
' "$f" "$m"

done
