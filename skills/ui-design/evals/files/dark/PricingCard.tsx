type Props = {
  plan: string;
  price: number;
  period: "month" | "year";
  features: string[];
  highlighted?: boolean;
  onSelect: () => void;
};

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0" aria-hidden="true">
      <path d="M6.2 11.3 3 8.1l1.1-1.1 2.1 2.1 5.7-5.7L13 4.5z" fill="#111827" />
    </svg>
  );
}

export function PricingCard({ plan, price, period, features, highlighted = false, onSelect }: Props) {
  return (
    <article
      className={
        "flex flex-col rounded-xl border bg-white p-6 shadow-lg " +
        (highlighted ? "border-blue-600" : "border-gray-200")
      }
    >
      <h3 className="text-lg font-medium text-gray-900">{plan}</h3>

      <p className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-semibold tabular-nums text-gray-900">${price}</span>
        <span className="text-sm text-gray-500">per {period}</span>
      </p>

      <ul className="mt-6 flex flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm text-gray-700">
            <Check />
            {feature}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSelect}
        className="mt-8 h-11 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Choose {plan}
      </button>
    </article>
  );
}
