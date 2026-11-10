ENV ?= staging
RELEASE ?=

.PHONY: deploy rollback migrate-plan tag-release drain-payments resume-payments payments-queue-depth \
	canary-status canary-promote canary-abort previous-release prod-revision staging-revision \
	deploy-lock-status deploy-unlock deploy-log

deploy:
	./deploy/bin/deploy --env $(ENV) $(if $(RELEASE),--release $(RELEASE),--release $(shell git rev-parse HEAD))

rollback:
	@test -n "$(RELEASE)" || (echo "RELEASE is required" && exit 1)
	./deploy/bin/deploy --env $(ENV) --release $(RELEASE) --rollback

migrate-plan:
	./deploy/bin/migrate --env $(ENV) --plan $(if $(RELEASE),--target $(RELEASE))

tag-release:
	./deploy/bin/tag-release

drain-payments:
	./deploy/bin/worker --env $(ENV) --name payments --drain

resume-payments:
	./deploy/bin/worker --env $(ENV) --name payments --resume

payments-queue-depth:
	./deploy/bin/worker --env $(ENV) --name payments --depth

canary-status:
	./deploy/bin/canary --env $(ENV) --status --watch 30

canary-promote:
	./deploy/bin/canary --env $(ENV) --promote

canary-abort:
	./deploy/bin/canary --env $(ENV) --abort

previous-release:
	./deploy/bin/deploy --env $(ENV) --previous

prod-revision:
	./deploy/bin/deploy --env prod --current

staging-revision:
	./deploy/bin/deploy --env staging --current

deploy-lock-status:
	./deploy/bin/lock --status

deploy-unlock:
	./deploy/bin/lock --release

deploy-log:
	./deploy/bin/deploy --env $(ENV) --release $(RELEASE) --log
