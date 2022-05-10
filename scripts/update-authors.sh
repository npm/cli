#!/bin/sh

git log --use-mailmap --reverse --format='%aN <%aE>' | grep -v -e "\[bot\]" -e "^npm team" -e "^npm CLI robot" | perl -wnE '
BEGIN {
  say "# Authors sorted by whether or not they\x27re me";
}

print $seen{$_} = $_ unless $seen{$_}
' > AUTHORS
