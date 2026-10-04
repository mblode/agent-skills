export function Landing() {
  return (
    <main className="relative">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-amber-100 to-transparent"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -left-40 top-20 size-96 rounded-full bg-purple-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-96 size-96 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[url(/grid.svg)] opacity-20" />

      <h1 className="max-w-[24ch] text-6xl font-semibold tracking-tight">
        Ship your payroll in a day, not a quarter
      </h1>
      <a href="/signup">Start free</a>

      <section aria-labelledby="customers">
        <h2 id="customers">Running payroll at</h2>
        <ul>
          <li><img src="/logos/monzo.svg" alt="Monzo" /></li>
          <li><img src="/logos/deliveroo.svg" alt="Deliveroo" /></li>
          <li><img src="/logos/octopus-energy.svg" alt="Octopus Energy" /></li>
          <li><img src="/logos/starling-bank.svg" alt="Starling Bank" /></li>
          <li><img src="/logos/gousto.svg" alt="Gousto" /></li>
          <li><img src="/logos/bulb.svg" alt="Bulb" /></li>
        </ul>
      </section>
      <div className="rounded-t-lg bg-zinc-200 p-3">
        <span className="inline-block size-3 rounded-full bg-red-500" />
        <span className="inline-block size-3 rounded-full bg-yellow-500" />
        <span className="inline-block size-3 rounded-full bg-green-500" />
        <span>https://app.example.com/payroll</span>
      </div>
      <img src="/screenshots/payroll-run.png" alt="A payroll run in progress" />

      <a href="/signup">Start free</a>
      <a href="/signup">Start free</a>
      <a href="/signup">Start free</a>
    </main>
  );
}
