import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/40 to-white p-6">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm">
        <PageShell
          title="Login"
          subtitle="Use a demo login for CW1. Real auth can be added later."
        >
          <div className="space-y-3">
            <input
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              placeholder="Email"
            />
            <input
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              placeholder="Password"
              type="password"
            />

            <button
              className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800"
              onClick={() => navigate("/app/dashboard")}
            >
              Sign in (demo)
            </button>

            <p className="text-xs text-gray-500">
              For CW1, this can be a demo flow. Later: JWT + role-based access.
            </p>
          </div>
        </PageShell>
      </div>
    </div>
  );
}
