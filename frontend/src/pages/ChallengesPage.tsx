import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import {
  createChallengeSubmission,
  getChallengeSubmissions,
  getChallenges,
} from "../api/challenges";
import { getDemoUser, getDemoUserId } from "../auth/demoAuth";
import type { Challenge, ChallengeSubmission } from "../api/types";

type Tab = "Group challenges" | "Personal challenges";
type TimeFilter = "Daily" | "Weekly" | "Monthly" | "Seasonal";

export default function ChallengesPage() {
  const [tab, setTab] = useState<Tab>("Group challenges");
  const [time, setTime] = useState<TimeFilter>("Weekly");

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [totalCO2e, setTotalCO2e] = useState("1");
  const [evidence, setEvidence] = useState("");
  const [lastResult, setLastResult] = useState<string | null>(null);

  useEffect(() => {
    async function loadChallenges() {
      setLoading(true);
      setError(null);
      setSelectedId(null);
      try {
        const type = tab === "Group challenges" ? "group" : "personal";
        const res = await getChallenges(type);
        const list = res.challenges || [];
        setChallenges(list);
        setSelectedId(list[0]?.challenge_id ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load challenges.");
      } finally {
        setLoading(false);
      }
    }

    loadChallenges();
  }, [tab]);

  useEffect(() => {
    async function loadSubmissions() {
      if (!selectedId) return;
      setLoadingSubs(true);
      setSubmitError(null);
      try {
        const res = await getChallengeSubmissions(selectedId, { limit: 20 });
        setSubmissions(res.submissions || []);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Failed to load submissions."
        );
      } finally {
        setLoadingSubs(false);
      }
    }

    loadSubmissions();
  }, [selectedId]);

  const selectedChallenge = useMemo(
    () => challenges.find((c) => c.challenge_id === selectedId) ?? null,
    [challenges, selectedId]
  );

  async function handleSubmit() {
    setSubmitError(null);
    setLastResult(null);

    const demoUserId = getDemoUserId();
    const user = getDemoUser();
    if (!demoUserId) {
      setSubmitError("Please sign in before submitting.");
      return;
    }
    if (!selectedChallenge) {
      setSubmitError("Select a challenge first.");
      return;
    }

    const total = Number(totalCO2e);
    if (!Number.isFinite(total) || total <= 0) {
      setSubmitError("Total CO2e must be a positive number.");
      return;
    }

    setSubmitting(true);
    try {
      const isGroup = selectedChallenge.challenge_type === "group";
      const res = await createChallengeSubmission(
        selectedChallenge.challenge_id,
        {
          total_co2e: total,
          evidence: evidence.trim() ? evidence.trim() : null,
          groupId: isGroup ? user?.group_id ?? null : null,
          userId: demoUserId,
        },
        demoUserId
      );
      setLastResult(
        `Submitted. Status: ${res.submission.status}. Points: ${res.submission.points}.`
      );
      const refresh = await getChallengeSubmissions(
        selectedChallenge.challenge_id,
        { limit: 20 }
      );
      setSubmissions(refresh.submissions || []);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submit failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell
      title="Challenges"
      subtitle="Complete challenges to earn points (and unlock SDG characters later)."
      right={
        tab === "Personal challenges" ? (
          <select
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
            value={time}
            onChange={(e) => setTime(e.target.value as TimeFilter)}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Seasonal</option>
          </select>
        ) : null
      }
    >
      <div className="flex gap-2">
        {(["Group challenges", "Personal challenges"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm ${
              tab === t ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm space-y-4">
        <div className="text-sm font-medium text-gray-900">
          {tab === "Group challenges"
            ? "This week's society challenge"
            : `Personal challenges • ${time}`}
        </div>
        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {loading && (
          <div className="text-sm text-gray-600">Loading challenges...</div>
        )}
        {!loading && challenges.length === 0 && (
          <div className="rounded-xl bg-white p-4 text-sm text-gray-700">
            No challenges available yet.
          </div>
        )}
        {!loading && challenges.length > 0 && (
          <div className="space-y-3">
            <select
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {challenges.map((c) => (
                <option key={c.challenge_id} value={c.challenge_id}>
                  {c.title}
                </option>
              ))}
            </select>

            {selectedChallenge && (
              <div className="rounded-xl bg-white p-4 space-y-2">
                <div className="text-sm text-gray-800">{selectedChallenge.title}</div>
                <div className="text-xs text-gray-500">
                  {selectedChallenge.start_date || "No start date"} •{" "}
                  {selectedChallenge.end_date || "No end date"}
                </div>
                <div className="text-xs text-gray-600">
                  Evidence required:{" "}
                  {selectedChallenge.rules?.evidence_required ? "Yes" : "No"}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-2">
              <div className="text-xs font-medium text-gray-900">
                Submit your total CO2e
              </div>
              <input
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
                placeholder="e.g., 5.5"
                value={totalCO2e}
                onChange={(e) => setTotalCO2e(e.target.value)}
              />
              <input
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
                placeholder="Evidence (optional unless required)"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                disabled={submitting || !selectedChallenge}
                className="rounded-xl bg-gray-900 px-3 py-2 text-xs text-white disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
              {submitError && (
                <div className="rounded-xl bg-red-50 p-2 text-xs text-red-700">
                  {submitError}
                </div>
              )}
              {lastResult && (
                <div className="rounded-xl bg-green-50 p-2 text-xs text-green-700">
                  {lastResult}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-2">
              <div className="text-xs font-medium text-gray-900">
                Top submissions
              </div>
              {loadingSubs && (
                <div className="text-xs text-gray-600">
                  Loading submissions...
                </div>
              )}
              {!loadingSubs && submissions.length === 0 && (
                <div className="text-xs text-gray-600">No submissions yet.</div>
              )}
              {!loadingSubs &&
                submissions.map((s) => (
                  <div
                    key={s.submission_id}
                    className="flex justify-between text-xs text-gray-700"
                  >
                    <span>{s.user_id.slice(0, 8)}…</span>
                    <span>
                      {s.points} pts • {s.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
