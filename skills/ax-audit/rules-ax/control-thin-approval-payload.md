---
title: Approval prompt names the action but not what it will do
slug: control-thin-approval-payload
category: control
defaultTier: fix-this-sprint
surfaces: agent-chat, agent-tool-execution
ax-pattern: The Approval Moment
detection: code-auditable
related: control-no-approval-gate, comm-no-approval-gate, comm-no-intent-handshake
---

## Approval prompt names the action but not what it will do

The gate is there. It fires on the right actions, it matches the stakes, and it asks "Allow the agent to send an email?" with a recipient, a subject, and a body the user never sees. There is nothing to weigh, so the answer is yes every time, which makes the gate a click-through rather than a decision.

As the interface shrinks, the approval moment is one of the few surfaces left. It has to carry exactly enough of the action for a confident yes or no, and a tool name is not enough.

## What goes wrong

The agent drafts a reply to a customer, gets it wrong, and asks for approval. The dialog reads "Send email? Allow / Deny". The user, six approvals into a session where the previous five were fine, allows it. The wrong reply goes to the customer. The gate did its job and prevented nothing, because the one fact that would have changed the answer, the body of the message, was the fact the dialog left out.

The reverse also happens: the dialog is so thin the user denies everything, and the agent becomes unusable for exactly the tasks it exists to do.

## Detection

**Surfaces:** agent-chat, agent-tool-execution

**Auditability:** code-auditable

**Static signals:**
1. Find approval and confirmation components: `ApprovalDialog`, `ConfirmAction`, `ToolApproval`, `PermissionPrompt`, anything rendering an allow and deny pair.
2. Read the props each one accepts, and the props the call site passes.
3. Flag components whose only action-describing input is a name or type (`toolName`, `action`, `actionType`, `title`) with no channel for the call arguments.
4. Flag call sites that have the arguments in scope and pass only the name.
5. For destructive actions, check that the target is named specifically (which record, how many rows), not by category.

**Concrete commands:**
```bash
# candidate approval surfaces: record this list, it is the evidence
rg -l 'Approval|ConfirmAction|PermissionPrompt|requiresApproval' --type=ts src/

# per candidate, does the surface ever reference the call's arguments?
# absence is the finding, so check each file rather than grepping for a negative
for f in $(rg -l 'Approval|ConfirmAction|PermissionPrompt' --type=ts src/); do
  rg -q 'args|payload|preview|diff|target|params|describeIntent' "$f" \
    || echo "thin approval surface: $f"
done

# the prop surface, to see what a call site is even able to pass
rg -n -A 8 'interface .*(Approval|Confirm).*Props' --type=ts src/

# gates that stringify the tool and stop there
rg -n 'confirm\(|window\.confirm' -A 2 --type=ts src/
```

**Judgment signals:**
- A payload rendered but truncated to one line for a multi-paragraph action is a partial pass; note it as `warn`, not `fail`.
- A diff view for edits and a plain summary for sends both count, as long as what changes is legible before the answer.

**False-positive guards:**
- Skip gates for low-stakes reversible actions where a receipt with undo is the right pattern instead. That is `control-no-approval-gate` territory, and this rule should not push toward more friction than the stakes need.
- A component that accepts a `children` or `preview` slot passes if the call sites populate it. Check the call sites, not just the type.
- Skip files with `// ax-audit-ignore:control-thin-approval-payload` near the match.
- Skip test and Storybook fixtures.

## Fix

Pass the call arguments through to the gate and render the ones that would change the answer.

```tsx
// before: the user approves a category
<ApprovalDialog
  toolName="send_email"
  onApprove={() => execute(call)}
  onDeny={reject}
/>

// after: the user approves this specific act
<ApprovalDialog
  toolName="send_email"
  summary={`Reply to ${call.args.to} about "${call.args.subject}"`}
  onApprove={() => execute(call)}
  onDeny={reject}
>
  <RecipientList to={call.args.to} cc={call.args.cc} />
  <BodyPreview body={call.args.body} expandable />
</ApprovalDialog>
```

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent chat | fix-this-sprint |
| Agent config | fix-this-sprint |
| Agent dashboard | fix-this-sprint |

## Examples

**Anti-pattern (fails):**

```tsx
function ToolApproval({ call, onApprove, onDeny }: Props) {
  return (
    <Prompt>
      <p>Allow the agent to run {call.name}?</p>
      <Button onClick={onApprove}>Allow</Button>
      <Button onClick={onDeny}>Deny</Button>
    </Prompt>
  );
}
```

`call.args` is in scope and never rendered.

**Applied (passes):**

```tsx
function ToolApproval({ call, onApprove, onDeny }: Props) {
  return (
    <Prompt>
      <p>{describeIntent(call)}</p>
      <ArgumentPreview args={call.args} highlight={call.destructiveFields} />
      <Button onClick={onApprove}>Allow</Button>
      <Button onClick={onDeny}>Deny</Button>
    </Prompt>
  );
}
```

## Suppression

```tsx
{/* ax-audit-ignore:control-thin-approval-payload, no arguments, the action is the whole payload */}
<ApprovalDialog toolName="end_session" onApprove={stop} onDeny={reject} />
```
