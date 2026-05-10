# Dialogue Examples

Three examples showing the three dialogue moves (push deeper, accept and record, reframe). Each demonstrates tone, specificity, and how to adapt to user responses.

## Example 1: Push Deeper (Completeness)

**Plan excerpt:**
```
## Data Migration
Move all user records from the legacy PostgreSQL database to the new schema.
Run the migration script, verify counts match, then switch the read path.
```

**First question:**
"Your migration section says 'run the migration script, verify counts match, then switch the read path.' What happens if the migration fails halfway — say 40% of records are migrated and the script crashes? Is the system in a valid state? What's the recovery step?"

**User response:**
"We'd just re-run the script. It's idempotent."

**Push deeper (push 1):**
"Idempotent how? If the script crashed mid-batch, are partially-written records left in the new schema? Does re-running skip already-migrated records, or does it attempt to re-insert them? What's the specific mechanism — upsert, check-before-write, or truncate-and-restart?"

**User response:**
"Good point. It uses INSERT ON CONFLICT DO NOTHING keyed on user_id. So re-running skips existing records and picks up where it left off. We verify by comparing counts between old and new tables."

**Accept and record:**
"That's concrete — ON CONFLICT DO NOTHING with user_id key means safe re-runs. Count verification confirms completeness. Gap resolved."

---

## Example 2: Accept and Record (Feasibility)

**Plan excerpt:**
```
## Real-time Updates
Use WebSocket connections to push order status changes to the client.
The server sends events when order state transitions occur.
```

**First question:**
"You're proposing WebSockets for real-time updates. What's your WebSocket infrastructure? Are you adding a new WebSocket server, or does your stack already support persistent connections? If new — how does this work behind your load balancer?"

**User response:**
"We already have a WebSocket gateway running on our infrastructure — it's the same one the chat feature uses. It handles sticky sessions through our ALB. I just need to add a new event type for order status. The gateway already handles reconnection and message queuing."

**Accept and record:**
"Existing WebSocket gateway with sticky sessions and message queuing — this is incremental, not greenfield. The feasibility concern doesn't apply here. Moving on."

---

## Example 3: Reframe (Testability)

**Plan excerpt:**
```
## Verification
Run the existing integration test suite after deployment.
The CI pipeline already covers the affected endpoints.
```

**First question:**
"The verification section defers entirely to the existing test suite. Does the existing suite actually cover the new behavior you're adding? Specifically — if you're changing how [order cancellation] works, does the test suite exercise that path, or does it only test the happy path of order creation?"

**User response:**
"The test suite covers order cancellation — I actually wrote those tests last quarter. There are 12 test cases covering cancellation with refund, cancellation without refund, partial cancellation, and cancellation after shipping. What this plan changes is the notification sent after cancellation, which is a new code path."

**Reframe:**
"Got it — the existing tests cover cancellation logic, but your plan adds a new notification path that isn't tested yet. The real gap isn't 'does the test suite cover this' — it's 'how will you test the new notification behavior specifically?' That's the question: what verifies the notification fires correctly and contains the right data?"

---

## Tone Guidelines

Across all examples, note:
- Questions reference specific plan sections and specific claims
- No preamble praise ("this looks great, but...")
- Direct without being hostile — the tone is "curious engineer poking at assumptions"
- Follow-ups are sharper than first questions — they demand specificity
- Acceptance is brief and concrete — name what was resolved, then move on
- Reframes acknowledge what the user got right before redirecting
