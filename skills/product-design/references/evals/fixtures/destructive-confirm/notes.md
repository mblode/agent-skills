# destructive-confirm

Rule IDs exercised:
- `rule/destructive-names-action`: "Confirm" must become Verb + Noun ("Delete project").
- `rule/no-confirm-ok-labels`: no bare "Confirm"/"OK"/"Yes" on a destructive action.
- `rule/name-object-scope-consequence`: the body must name the object, the scope (deployment count), and the consequence (permanent).
- `rule/modal-body-scroll`: content belongs in a scrollable body so the footer actions stay reachable.

Judge should check:
- The primary destructive CTA names the object.
- Scope and consequence are stated before the user commits.
- The cancel path is preserved and not emphasized over delete.

Do not credit a fix that renames the button but leaves the body as a generic "Are you sure?" with no scope or consequence.
