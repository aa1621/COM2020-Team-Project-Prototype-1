import { useState } from "react";
import PageShell from "../components/PageShell";

type Tab = "Invites" | "My groups" | "Find group" | "Send invite";

export default function GroupsPage() {
  const [tab, setTab] = useState<Tab>("Invites");
  const tabs: Tab[] = ["Invites", "My groups", "Find group", "Send invite"];

  return (
    <PageShell title="Groups" subtitle="Join societies, manage invites, and build community.">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
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

      <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm">
        {tab === "Invites" && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-900">Pending invites</div>
            <div className="rounded-xl bg-white p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-800">Cycling Society</div>
                <div className="text-xs text-gray-500">Invited by: Alex</div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-xl bg-gray-900 px-3 py-2 text-xs text-white">Accept</button>
                <button className="rounded-xl bg-gray-100 px-3 py-2 text-xs text-gray-800">Decline</button>
              </div>
            </div>
          </div>
        )}

        {tab === "My groups" && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-900">Groups you are in</div>
            <ul className="space-y-2">
              {["Eco Society", "Hiking Society"].map((g) => (
                <li key={g} className="rounded-xl bg-white p-4 text-sm text-gray-800">
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "Find group" && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-900">Find a group</div>
            <input
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              placeholder="Search societies…"
            />
            <div className="rounded-xl bg-white p-4 text-sm text-gray-800">
              Example result: “Sustainability Society” <span className="text-xs text-gray-500">(Join)</span>
            </div>
          </div>
        )}

        {tab === "Send invite" && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-900">Send an invite</div>
            <input
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              placeholder="Search for a user (name/email)…"
            />
            <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
              <option>Invite to… (choose a society you’re in)</option>
              <option>Eco Society</option>
              <option>Hiking Society</option>
            </select>
            <button className="rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white">
              Send invite (demo)
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
