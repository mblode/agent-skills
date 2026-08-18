import { useState } from "react";

// Opened with Cmd+K, used constantly throughout the day.
export function CommandMenu({ open }: { open: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 grid place-items-center">
      <input autoFocus placeholder="Type a command" />
    </div>
  );
}

export function SettingsPanel() {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <section>
      {/* No :active or transition on a pressable control */}
      <button onClick={() => setExpanded(!expanded)} className="rounded-md px-3 py-2">
        Advanced
      </button>

      {/* Teleporting state: appears and vanishes with no bridge */}
      {expanded && (
        <div className="mt-2 rounded-md border p-4">
          <label htmlFor="key">API key</label>
          <input id="key" />
        </div>
      )}

      {/* Rare, high-emotion moment rendered flat */}
      {saved && <p>Everything is up to date.</p>}

      <button onClick={() => setSaved(true)}>Save</button>

      {/* Functional data the user is reading */}
      <table>
        <tbody>
          <tr>
            <td>Requests</td>
            <td className="tabular-nums">18,204</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
