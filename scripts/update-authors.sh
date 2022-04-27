#!/bin/sh

git log --use-mailmap --reverse --format='%aN <%aE>' | grep -v "\[bot\]" | grep -v "ops+robot" | grep -v "npm cli ops bot" |  perl -wnE '
BEGIN {
  say "# Authors sorted by whether or not they\x27re me";
}

print $seen{$_} = $_ unless $seen{$_}
' > AUTHORS
