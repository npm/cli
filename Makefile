# vim: set softtabstop=2 shiftwidth=2:
SHELL = bash

PUBLISHTAG = $(shell node scripts/publish-tag.js)
BRANCH = $(shell git rev-parse --abbrev-ref HEAD)

# these docs have the @VERSION@ tag in them, so they have to be rebuilt
# whenever the package.json is touched, in case the version changed.
version_mandocs = $(shell grep -rl '@VERSION@' docs/content \
									|sed 's|.md|.1|g' \
									|sed 's|docs/content/commands/|man/man1/|g' )

cli_mandocs = $(shell find docs/content/commands -name '*.md' \
               |sed 's|.md|.1|g' \
               |sed 's|docs/content/commands/|man/man1/|g' )

files_mandocs = $(shell find docs/content/configuring-npm -name '*.md' \
               |sed 's|.md|.5|g' \
               |sed 's|docs/content/configuring-npm/|man/man5/|g' )

misc_mandocs = $(shell find docs/content/using-npm -name '*.md' \
               |sed 's|.md|.7|g' \
               |sed 's|docs/content/using-npm/|man/man7/|g' )

mandocs = $(cli_mandocs) $(files_mandocs) $(misc_mandocs)

markdown_docs = $(shell for file in $(find lib/commands -name '*.js'); do echo docs/content/commands/npm-$(basename $file .js).md; done)

all: docs

docs: mandocs htmldocs $(markdown_docs)

# don't regenerate the snapshot if we're generating
# snapshots, since presumably we just did that.
mandocs: deps $(mandocs)
	@ ! [ "$${npm_lifecycle_event}" = "snap" ] && \
	  ! [ "$${npm_lifecycle_event}" = "postsnap" ] && \
	  TAP_SNAPSHOT=1 node test/lib/utils/config/definitions.js || true

$(version_mandocs): package.json

htmldocs: deps
	node bin/npm-cli.js rebuild cmark-gfm
	node docs/bin/dockhand.js

clean: docsclean gitclean

docsclean:
	rm -rf man

deps:
	node bin/npm-cli.js run resetdeps

## targets for man files, these are encouraged to be only built by running `make docs` or `make mandocs`
man/man1/%.1: docs/content/commands/%.md docs/bin/docs-build.js
	@[ -d man/man1 ] || mkdir -p man/man1
	node docs/bin/docs-build.js $< $@

man/man5/npm-json.5: man/man5/package.json.5
	cp $< $@

man/man5/npm-global.5: man/man5/folders.5
	cp $< $@

man/man5/%.5: docs/content/configuring-npm/%.md docs/bin/docs-build.js
	@[ -d man/man5 ] || mkdir -p man/man5
	node docs/bin/docs-build.js $< $@

man/man7/%.7: docs/content/using-npm/%.md docs/bin/docs-build.js
	@[ -d man/man7 ] || mkdir -p man/man7
	node docs/bin/docs-build.js $< $@

# Any time the config definitions description changes, automatically
# update the documentation to account for it
docs/content/using-npm/config.md: docs/bin/config-doc.js lib/utils/config/*.js
	node docs/bin/config-doc.js

mddocs: docs/bin/config-doc-command.js lib/utils/config/*.js lib/utils/cmd-list.js
	@for file in $(shell find docs/content/commands -name 'npm-*.md'); do \
		cmdname=$$(basename $$file .md) ;\
		cmdname=$${cmdname##npm-} ;\
		echo node docs/bin/config-doc-command.js $${file} lib/commands/$${cmdname}.js ;\
		node docs/bin/config-doc-command.js $${file} lib/commands/$${cmdname}.js ;\
	done

docs/content/commands/npm-%.md: lib/commands/%.js
	node docs/bin/config-doc-command.js $@ $<

freshdocs:
	touch lib/utils/config/definitions.js
	touch docs/bin/*.js
	make docs
	make mddocs

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

publish: gitclean ls-ok link test-all docs prune
	git push origin $(BRANCH) &&\
	git push origin --tags &&\
	node bin/npm-cli.js publish --tag=$(PUBLISHTAG)

release: gitclean ls-ok docs prune
	@bash scripts/release.sh

.PHONY: all latest install dev link docs mddocs clean uninstall test-all man docsclean release ls-ok deps prune freshdocs
