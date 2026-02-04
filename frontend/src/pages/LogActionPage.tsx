import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import { apiFetch } from "../api/client";
import { getDemoUserId } from "../auth/demoAuth";
import type {
  ActionType,
  GetActionTypesResponse,
  CreateActionLogResponse,
} from "../api/types";

export default function LogActionPage() {
  const [actionTypes, setActionTypes] = useState<ActionType[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");

  const [result, setResult] = useState<CreateActionLogResponse | null>(null);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => actionTypes.find((a) => a.key === selectedKey) ?? null,
    [actionTypes, selectedKey]
  );

  // Load action types on page load
  useEffect(() => {
    async function loadActionTypes() {
      setLoadingTypes(true);
      setError(null);
      try {
        const res = await apiFetch<GetActionTypesResponse>("/action-types");
        setActionTypes(res.actionTypes);

        // Pick first by default
        if (res.actionTypes.length > 0) {
          setSelectedKey(res.actionTypes[0].key);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load action types");
      } finally {
        setLoadingTypes(false);
      }
    }

    loadActionTypes();
  }, []);

  async function onSubmit() {

    console.log("SUBMIT CLICKED", { selectedKey, quantity });
    setError(null);
    setResult(null);

    const qty = Number(quantity);
    const demoUserId = getDemoUserId();
    if (!demoUserId) return setError("Please sign in to submit an action.");
    if (!selectedKey) return setError("Please select an action.");
    if (!Number.isFinite(qty) || qty <= 0)
      return setError("Quantity must be a positive number.");

    setSubmitting(true);
    try {
      console.log("ABOUT TO CALL BACKEND");

      const res = await apiFetch<CreateActionLogResponse>("/action-logs", {
        method: "POST",
        headers: { "x-user-id": demoUserId },
        body: JSON.stringify({
          action_type_key: selectedKey,
          quantity: qty,
        }),
      });

      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    
    <PageShell
      title="Log action"
      subtitle="Log a real-world action and see how the estimate is calculated."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Action</label>

            {loadingTypes ? (
              <div className="text-sm text-gray-600">Loading actions…</div>
            ) : (
              <select
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
              >
                {actionTypes.map((a) => (
                  <option key={a.key} value={a.key}>
                    {a.category} • {a.name} ({a.unit})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">
              Quantity {selected ? `(${selected.unit})` : ""}
            </label>
            <input
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g., 3"
            />
          </div>

          <button
            onClick={onSubmit}
            disabled={submitting || loadingTypes}
            className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Transparency / result panel */}
        <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-900">
            How we estimate this
          </div>

          {!result ? (
            <p className="mt-2 text-sm text-gray-700">
              Pick an action and submit to see the backend calculation.
            </p>
          ) : (
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <div className="rounded-xl bg-green-50 p-4">
                <div className="font-medium text-gray-900">
                  Estimated: {result.calculation.estimateKgCO2e.toFixed(3)} kg
                  CO₂e
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Range: {result.calculation.rangeKgCO2e.min.toFixed(3)}–
                  {result.calculation.rangeKgCO2e.max.toFixed(3)} kg CO₂e
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-4">
                <div className="text-xs font-medium text-gray-900">Logged</div>
                <div className="text-xs text-gray-600 mt-1">
                  {result.actionType.name} • {result.log.quantity}{" "}
                  {result.actionType.unit} • score {result.log.score}
                </div>
              </div>

              <div className="text-xs text-gray-600">
                <span className="font-medium">Confidence:</span>{" "}
                {result.calculation.confidence}
              </div>
              <div className="text-xs text-gray-600">
                {result.calculation.caveat}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
