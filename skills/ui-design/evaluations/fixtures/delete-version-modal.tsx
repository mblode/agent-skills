"use client";

export function DeleteVersionModal({
  versionLabel,
  onCancel,
  onConfirm,
}: {
  versionLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      aria-modal="true"
      className="w-96 rounded-lg bg-white p-6"
      role="dialog"
    >
      <h2 className="font-medium text-base">Delete version</h2>
      <p className="mt-2 text-gray-600 text-sm">
        This will delete {versionLabel}. This action cannot be undone.
      </p>
      <div className="mt-6 flex justify-end gap-2">
        <button className="rounded border px-4 py-2 text-sm" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="rounded border px-4 py-2 text-sm"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
