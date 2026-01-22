import { useState } from "react";
import PageShell from "../components/PageShell";

export default function LogActionPage() {
  const [category, setCategory] = useState("Travel");
  const [amount, setAmount] = useState("1");

  return (
    <PageShell
      title="Log action"
      subtitle="Log a real-world action and see how the estimate is calculated."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Category</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Travel</option>
              <option>Food</option>
              <option>Energy</option>
              <option>Waste</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Amount</label>
            <input
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 3 km cycled"
            />
          </div>

          <button className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800">
            Submit (demo)
          </button>
        </div>

        {/* Transparency panel */}
        <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-900">How we estimate this</div>
          <p className="mt-2 text-sm text-gray-700">
            Category: <span className="font-medium">{category}</span> • Amount:{" "}
            <span className="font-medium">{amount}</span>
          </p>
          <div className="mt-4 rounded-xl bg-green-50 p-4">
            <p className="text-xs text-gray-700">
              Example transparency:
              <br />
              <span className="font-medium">Factor:</span> average kgCO₂e per unit (placeholder)
              <br />
              <span className="font-medium">Confidence:</span> Medium
              <br />
              <span className="font-medium">Caveat:</span> actual emissions vary by context
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
