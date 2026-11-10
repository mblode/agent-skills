import { Button } from "@/components/ui/button";
import { Card, CardActions, CardBody, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/money";

interface RefundApproval {
  approvalId: string;
  display: {
    customerName: string;
    orderNumber: string;
    amountCents: number;
    currency: string;
    reason: string;
    alreadyRefundedCents: number;
  };
}

interface Props {
  approval: RefundApproval;
  running: boolean;
  onDecision: (approvalId: string, outcome: "approved" | "denied") => void;
  abortController: AbortController;
}

export function RefundApprovalCard({ approval, running, onDecision, abortController }: Props) {
  const { display } = approval;

  return (
    <Card role="group" aria-label="Refund approval">
      <CardTitle>
        Refund {formatMoney(display.amountCents, display.currency)} to {display.customerName}?
      </CardTitle>
      <CardBody>
        <dl>
          <dt>Order</dt>
          <dd>{display.orderNumber}</dd>
          <dt>Reason</dt>
          <dd>{display.reason}</dd>
          <dt>Already refunded on this order</dt>
          <dd>{formatMoney(display.alreadyRefundedCents, display.currency)}</dd>
        </dl>
        <p>Refunds cannot be reversed once they are sent to the card network.</p>
      </CardBody>
      <CardActions>
        <Button variant="secondary" onClick={() => onDecision(approval.approvalId, "denied")}>
          Deny
        </Button>
        <Button onClick={() => onDecision(approval.approvalId, "approved")}>Approve refund</Button>
        {running ? (
          <Button variant="ghost" onClick={() => abortController.abort()}>
            Stop
          </Button>
        ) : null}
      </CardActions>
    </Card>
  );
}
