GULP_BIN = node_modules/.bin/gulp

default: install dev

clean:
	@$(GULP_BIN) clean
	@rm -rf node_modules

install: npm_install version

npm_install:
	mkdir -p public/dist
	@NODE_ENV=development npm install

server:
	@PORT=8000 NODE_ENV=production $(GULP_BIN) server

dev: 
	@$(GULP_BIN) dev-server

build:
	@$(GULP_BIN) build

deploy_assets:
	@$(GULP_BIN) deploy-s3-assets

test:
	@$(GULP_BIN) test

# test_ci:
# 	@$(GULP_BIN) test_ci
#
# version: $(GULP_BIN)
# 	sh ./bin/detect_git-sha.sh

lint:
	@$(GULP_BIN) eslint

stylelint:
	@$(GULP_BIN) stylelint

# e2e:
# 	@$(GULP_BIN) e2e

.PHONY: default clean install server dev build test lint stylelint
