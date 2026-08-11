export function ApiKeySettings({
  keys,
  onRevoke,
  status,
}: {
  keys: { id: string; label: string; lastUsed: string }[];
  onRevoke: (id: string) => void;
  status: "idle" | "loading" | "error";
}) {
  if (status === "loading") return <KeyListSkeleton />;
  if (status === "error")
    return (
      <p role="alert" className="text-sm text-red-700">
        We could not load your keys. <button className="underline">Retry</button>
      </p>
    );

  return (
    <section className="max-w-2xl">
      <h2 className="text-base font-medium text-zinc-900">API keys</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Keys are shown once when created. Revoking takes effect immediately.
      </p>

      {keys.length === 0 ? (
        <div className="mt-6 rounded-md border border-zinc-950/10 p-6">
          <p className="text-sm text-zinc-900">No API keys yet</p>
          <p className="mt-1 text-sm text-zinc-500">
            Create one to start calling the API from your own services.
          </p>
          <button className="mt-4 rounded-md bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
            Create key
          </button>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-950/5">
          {keys.map((k) => (
            <li key={k.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-zinc-900">{k.label}</p>
                <p className="mt-0.5 text-sm text-zinc-500">
                  Last used {k.lastUsed}
                </p>
              </div>
              <button
                onClick={() => onRevoke(k.id)}
                className="rounded-md px-2 py-1 text-sm text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                Revoke {k.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function KeyListSkeleton() {
  return (
    <div className="mt-6 animate-pulse space-y-3" aria-hidden="true">
      <div className="h-10 rounded bg-zinc-100" />
      <div className="h-10 rounded bg-zinc-100" />
    </div>
  );
}
