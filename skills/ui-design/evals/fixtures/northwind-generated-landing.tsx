export function Landing() {
  return (
    <main>
      <header className="flex items-center justify-between px-6 py-4">
        <a href="#" className="font-semibold">Northwind</a>
        <a href="#pricing" className="rounded-full bg-stone-900 px-4 py-2 text-white">
          Try Northwind <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="px-6 py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em]">Folder sync for small teams</p>
        <h1 className="text-6xl font-medium">
          Stay in sync.
          <br />
          Keep it simple.
        </h1>
        <p>Keeps both versions side by side when two people edit offline. 14-day free trial, no card.</p>
        <a href="#trial" className="rounded-full bg-stone-900 px-6 py-3 text-white">Start your 14-day free trial</a>
      </section>

      <section id="features" className="px-6 py-24">
        <p className="text-xs font-bold uppercase tracking-[0.2em]">Made for working together</p>
        <h2 className="text-4xl font-semibold">
          Same file.
          <br />
          Different flights.
          <br />
          Both edits kept.
        </h2>
        {[
          { number: "01", title: "Keep both", body: "Offline edits to the same file keep both versions side by side." },
          { number: "02", title: "Local first", body: "LAN first, encrypted relay when you are apart." },
          { number: "03", title: "Better than the rest", body: "Most sync tools pick a winner. Northwind keeps both versions." },
        ].map((f) => (
          <article key={f.number}>
            <span className="font-mono text-[11px]">{f.number}</span>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </article>
        ))}
      </section>

      <section id="setup" className="px-6 py-24">
        <h2 className="text-3xl font-semibold">Set up in three steps</h2>
        <ol>
          <li>1. Install Northwind on macOS or Windows (Linux is in beta)</li>
          <li>2. Pick the folder to share</li>
          <li>3. Invite your team</li>
        </ol>
      </section>

      <section id="pricing" className="px-6 py-24">
        <p className="text-xs font-bold uppercase tracking-[0.2em]">Simple pricing</p>
        <h2 className="text-4xl font-semibold">$8 per seat, per month</h2>
        <ul>
          <li>Both versions kept on offline conflicts</li>
          <li>Conflict mode: keep both, or ask me every time</li>
          <li>Admin roles and Slack alerts</li>
        </ul>
        <p>14-day free trial. No card required.</p>
        <a href="#pricing" className="rounded-full bg-stone-900 px-6 py-3 text-white">Start free trial</a>
      </section>

      <section className="px-6 py-24">
        <h2 className="text-3xl font-semibold">Questions</h2>
        <dl>
          <dt>What happens when two people edit offline?</dt>
          <dd>Northwind keeps both versions side by side.</dd>
          <dt>Do I need a card for the trial?</dt>
          <dd>No card required for the 14-day free trial.</dd>
        </dl>
      </section>
    </main>
  );
}
