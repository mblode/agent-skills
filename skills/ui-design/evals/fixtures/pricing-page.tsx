type Plan = { id: string; name: string; price: string };

export function PricingPage({
  plans,
  onSelect,
}: {
  plans: Plan[];
  onSelect: (id: string) => void;
}) {
  return (
    <main style={{ fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontWeight: 900, letterSpacing: "0.08em" }}>
        Pricing that "just works"
      </h1>
      <p style={{ fontSize: "13px", letterSpacing: "0.05em", lineHeight: 1.2 }}>
        Every plan includes unlimited projects, priority support, and a 30 day
        free trial. You don't need a credit card, and you can cancel anytime.
      </p>
      {plans.map((plan) => (
        <div key={plan.id} onClick={() => onSelect(plan.id)}>
          <h3 style={{ fontWeight: 900 }}>{plan.name}</h3>
          <p>{plan.price}/mo</p>
        </div>
      ))}
    </main>
  );
}
