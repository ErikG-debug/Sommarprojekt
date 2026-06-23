"use client";

import { useEffect, useState } from "react";

interface Props {
  field: "signature" | "aiSignature";
  label: string;
  description: string;
  placeholder?: string;
}

export function SignatureEditor({ field, label, description, placeholder }: Props) {
  const [saved, setSaved] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSaved(data[field] ?? ""))
      .catch(() => setSaved(""));
  }, [field]);

  function startEdit() {
    setDraft(saved ?? "");
    setEditing(true);
    setError(null);
  }

  function cancelEdit() {
    setEditing(false);
    setError(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: draft }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Något gick fel.");
        return;
      }
      setSaved(draft);
      setEditing(false);
    } catch {
      setError("Kunde inte nå servern.");
    } finally {
      setSaving(false);
    }
  }

  if (saved === null) {
    return <div className="h-28 animate-pulse rounded-md bg-gray-100" />;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-gray-900">{label}</h2>
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={startEdit}
            className="shrink-0 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {saved ? "Redigera" : "Lägg till"}
          </button>
        )}
      </div>

      {editing ? (
        <>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            autoFocus
            placeholder={placeholder ?? ""}
            className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#1a6ba8] focus:ring-2 focus:ring-[#1a6ba8]/20"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || draft === saved}
              className="rounded-md bg-[#1a6ba8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#155a8f] disabled:opacity-40"
            >
              {saving ? "Sparar…" : "Spara"}
            </button>
          </div>
        </>
      ) : saved ? (
        <p className="whitespace-pre-wrap rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
          {saved}
        </p>
      ) : (
        <p className="text-sm text-gray-400">Ingen signatur inställd.</p>
      )}
    </div>
  );
}
