---
name: deploy-checklist
description: Walks through deploying the Orchard storefront to staging and production, including pre-deploy checks, the canary, monitoring, and rollback. Use when asked to "deploy", "ship to prod", "run the release", "roll back", or "is it safe to deploy".
---

# Deploy Checklist

This skill helps you deploy the Orchard storefront safely. Deployment is one of the most important parts of the software development lifecycle, and doing it well takes care, attention, and good communication. Read this whole document carefully before you begin, and refer back to it whenever you are unsure.

A good deployment is a boring deployment. The goal is always to get working software in front of customers without surprising anyone.

## Why deployment discipline matters

Deployments are the moment when code changes meet real users. Even a small change can have a large effect, so it is important to be careful and methodical.

- A bad deploy can cause downtime, which costs money and damages trust.
- A rushed deploy is more likely to contain mistakes.
- A well-communicated deploy means that everyone knows what is happening.
- A reversible deploy means that mistakes can be fixed quickly.

Always remember that it is better to deploy slowly and safely than quickly and dangerously. Take your time. Double-check your work. If something does not look right, stop and think.

## What a deployment is

A deployment is the process of taking a built version of the application and running it in an environment. Orchard has two environments: staging and production. Staging is a copy of production that is used for checking changes before customers see them. Production is the environment that customers use.

Continuous integration (CI) is a practice where every change is automatically built and checked. CI helps catch problems early. You should always make sure CI has passed before deploying. A red build means something is wrong, and you should never deploy a red build.

A release is a tagged commit on `main`. Tags look like `r2025.06.12-1`: the date, then a counter for that day.

## Before you start

Think carefully about what you are about to deploy. Understand the change. Read the diff. Ask yourself whether you would be comfortable explaining it to a colleague.

- Make sure you understand what the change does.
- Make sure the commit messages are clear and descriptive.
- Make sure the pull request has been reviewed and approved.
- Make sure you have enough time to watch the deploy through to the end.
- Production is frozen from Friday 14:00 UTC until Monday 07:00 UTC. Do not start a production deploy inside the freeze. A fix for an active incident is the only exception, and the incident commander named in the incident channel approves it.
- Production is also frozen on the dates listed in `deploy/freeze-dates.txt` (sale days). Check the file, do not rely on memory.
- Only one production deploy runs at a time. `make deploy-lock-status` prints who holds the lock. If someone else holds it, wait.
- Remember that other people may be affected by your deploy, so be considerate.

## Understanding the pipeline

It helps to understand how the pipeline works so that you know what to expect.

1. A developer opens a pull request.
2. CI runs the checks.
3. A reviewer approves the pull request.
4. The pull request is merged to `main`.
5. `main` is deployed to staging automatically.
6. Someone tags a release and deploys it to production.

Each step exists for a reason. Skipping a step increases risk. If a step fails, find out why before continuing. Do not retry blindly and hope for the best.

## Pre-deploy checks

Before deploying to production, work through these checks in order. Do not skip any of them, even if you are in a hurry.

1. Confirm CI is green on the commit you are releasing.
2. Confirm staging is running that same commit: `make staging-revision` prints it.
3. Run `make migrate-plan ENV=prod`. It prints the migrations that would run. Paste the output into the release thread before you deploy, even when it prints "no pending migrations".
4. If the plan includes a migration marked `irreversible`, stop. A person from the data team approves it in the release thread first.
5. Check that the release notes draft exists for the tag.
6. Make sure all tests are passing and that you have tested your changes thoroughly.
7. Make sure there are no known issues that would make this a bad time to deploy.
8. Double-check everything one more time.

Testing is very important. Untested code is broken code. Always make sure that the code has been tested before it is deployed, and consider whether additional testing would be valuable.

## Communication

Good communication is the foundation of a good deployment. Keep your team informed at every stage.

- Tell people before you start.
- Tell people when you finish.
- Tell people if something goes wrong.
- Be clear and concise in your messages.
- Be polite and professional.
- Do not assume that people know what you are doing.

Post in the release thread when the deploy starts and when it ends. If you are unsure whether to communicate something, communicate it. Over-communication is better than under-communication.

## Deploying to staging

Staging deploys happen automatically when a change merges to `main`, so most of the time there is nothing to do.

- To redeploy staging by hand, run `make deploy ENV=staging`.
- Staging uses the payment provider's test mode. Never point staging at live payment keys.
- Staging data is reset every Sunday at 03:00 UTC, so a check that depends on a particular order must recreate it.
- Always check that staging looks right before moving on to production.

## What a canary is

A canary deployment is a technique where the new version is released to a small percentage of traffic first. If the canary is healthy, the rollout continues. If it is unhealthy, the rollout stops. The name comes from the canaries that miners used to detect dangerous gases.

Canaries are valuable because they limit the blast radius of a bad change. Instead of every customer seeing a bug, only a few do. This gives you time to notice and react.

## Deploying to production

Follow these steps carefully and in order.

1. Tag the release: `make tag-release`. It prints the new tag.
2. Drain the payments worker before anything else: `make drain-payments ENV=prod`, then wait for `make payments-queue-depth ENV=prod` to print 0. The web tier must not change version while a payment capture is in flight.
3. Start the deploy: `make deploy ENV=prod RELEASE=<tag>`.
4. The deploy starts a canary at 5% of traffic. Hold the canary for 20 minutes.
5. Abort the canary with `make canary-abort ENV=prod` if either of these is true at any point during the hold:
   - p95 checkout latency is over 800ms for three consecutive minutes.
   - the checkout error rate is over 0.5%.
6. If the canary is healthy after the hold, promote it: `make canary-promote ENV=prod`.
7. Resume the payments worker: `make resume-payments ENV=prod`.
8. Confirm the new revision is live: `make prod-revision`.

Stay calm and focused throughout. Do not multitask during a production deploy. If anything unexpected happens, pause and think before acting.

Never run `make deploy ENV=prod` without `RELEASE=`. Without it the target deploys whatever is checked out locally, which is how an unreviewed branch reached production once.

## Monitoring

Monitoring is how you know whether a deploy is healthy. Always watch the dashboards during and after a deploy.

- Watch the checkout dashboard while the canary runs.
- Hold the canary for 10 minutes before promoting it.
- Look at error rates, latency, and throughput.
- Compare the canary's numbers with the baseline.
- Look at the logs for anything unusual.
- Trust the data, but also trust your instincts. If something feels wrong, investigate.
- After promotion, keep watching for another 30 minutes.

`make canary-status ENV=prod` prints the canary's p95 checkout latency and error rate beside the baseline's, refreshed every 30 seconds.

Remember that not every problem shows up straight away. Some problems only appear under load or after a cache expires. Be patient and keep watching.

## Rollback

If something goes wrong after promotion, roll back. Rolling back is not a failure. It is the system working as intended.

1. Find the previous release tag: `make previous-release ENV=prod`.
2. Check whether the release you are leaving ran an irreversible migration: `make migrate-plan ENV=prod RELEASE=<previous tag>` prints "blocked" if it did.
3. If it prints "blocked", do not roll back the code. Page the data team and fix forward.
4. Otherwise drain the payments worker: `make drain-payments ENV=prod`, and wait for the queue depth to reach 0.
5. Roll back: `make rollback ENV=prod RELEASE=<previous tag>`.
6. Resume the payments worker: `make resume-payments ENV=prod`.
7. Post in the release thread: what was rolled back, to which tag, and why.

Do not be afraid to roll back. It is always better to roll back and investigate calmly than to leave a broken version in production while you debug.

## After the deploy

A deploy is not finished when the new version is live. There are still a few things to do.

- Publish the release notes draft for the tag.
- Post the end-of-deploy message in the release thread with the tag and the canary numbers at promotion.
- Release the deploy lock: `make deploy-unlock`. The lock does not expire on its own, and a forgotten lock blocks the next person.
- Reflect on how the deploy went and whether anything could be improved next time.
- Thank anyone who helped.

## General tips

Here are some general tips for successful deployments.

- Small deploys are safer than large deploys.
- Deploy early in the day so that you have time to respond to problems.
- Do not deploy when you are tired or distracted.
- Keep a clear head and work methodically.
- Write things down as you go.
- Learn from every deploy, whether it goes well or badly.
- Ask for help if you need it. Nobody knows everything.
- Automation is your friend. Prefer scripts to manual steps.
- Always think about the customer.

## Common mistakes

These are some mistakes that people commonly make when deploying.

- Deploying without reading the diff.
- Deploying without checking CI.
- Forgetting to tell the team.
- Walking away before the deploy has finished.
- Panicking when something goes wrong.
- Promoting the canary while the payments worker is still draining. The promote target does not check, and captures that started on the old version fail on the new one.
- Not learning from past mistakes.

## Reference files

| File | Read when |
|------|-----------|
| `references/rollback.md` | Rolling back a production release |

## Final thoughts

Deployment is a skill that improves with practice. Follow the checklist, communicate clearly, watch the dashboards, and roll back when you need to. If you do these things, your deploys will be safe and uneventful, which is exactly what a deploy should be.
