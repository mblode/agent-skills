import { Button } from "@/components/ui/button";
import { Dialog, DialogActions, DialogTitle } from "@/components/ui/dialog";

const LABELS: Record<string, string> = {
  send_email: "send an email",
  issue_credit: "issue a credit",
  close_ticket: "close a ticket",
};

interface ApprovalDialogProps {
  callId: string;
  toolName: string;
  onDecision: (callId: string, decision: "approved" | "denied") => void;
}

export function ApprovalDialog({ callId, toolName, onDecision }: ApprovalDialogProps) {
  const label = LABELS[toolName] ?? toolName;

  return (
    <Dialog open modal>
      <DialogTitle>Allow Relay Assistant to {label}?</DialogTitle>
      <DialogActions>
        <Button variant="secondary" onClick={() => onDecision(callId, "denied")}>
          Deny
        </Button>
        <Button autoFocus onClick={() => onDecision(callId, "approved")}>
          Allow
        </Button>
      </DialogActions>
    </Dialog>
  );
}
