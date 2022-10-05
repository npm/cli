# vim: set softtabstop=2 shiftwidth=2:
SHELL = bash

PUBLISHTAG = $(shell node scripts/publish-tag.js)

deps:
	node bin/npm-cli.js run resetdeps

lint-all: deps
	node bin/npm-cli.js run lint-all

test-all: deps
	node bin/npm-cli.js run test-all

ls-ok:
	node bin/npm-cli.js ls --omit=dev >/dev/null

gitclean:
	git clean -fd

uninstall:
	node bin/npm-cli.js rm -g -f npm

link: uninstall
	node bin/npm-cli.js link -f --ignore-scripts

prune: deps
	node bin/npm-cli.js prune --omit=dev --no-save --no-audit --no-fund
	node scripts/git-dirty.js

publish: gitclean ls-ok link lint-all test-all prune
	node bin/npm-cli.js publish --tag=$(PUBLISHTAG)

release: gitclean ls-ok prune
	@bash scripts/release.sh

.PHONY: link gitclean uninstall lint-all test-all release ls-ok deps prune
