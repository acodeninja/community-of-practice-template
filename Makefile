.DEFAULT_GOAL := help
SHELL := bash
MAKEFLAGS += --no-print-directory

.PHONY: help ## Display this help message
help:
	@echo
	@echo "CPS Communities of Practice Docs"
	@echo "Usage: make <goal>"
	@cat $(MAKEFILE_LIST) | grep -E '^\.PHONY: [a-zA-Z_\-\/]+.*?## .*$$' | \
		awk 'BEGIN {FS = " ## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' | sed 's/\.PHONY: //'

.PHONY: build ## Build the static site
build: install
	@docker run -it --rm -v "$(shell pwd):/content" --env "CI=true" cps/documentation-builder build

.PHONY: dev ## Run a local developer server
dev: install
	@docker run -it --rm -v "$(shell pwd):/content" -p 8000:8000 cps/documentation-builder dev

.PHONY: install ## Build the docker image used to build or serve the docs
install: .built
.built:
	@docker build -t cps/documentation-builder .
	@date > .built

clean:
	@rm .built
	@docker image rm cps/documentation-builder
