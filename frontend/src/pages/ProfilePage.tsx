import PageShell from "../components/PageShell";

export default function ProfilePage() {
  return (
    <PageShell title="Profile / Settings" subtitle="Manage your account and preferences.">
      <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm">
        <p className="text-sm text-gray-700">Coming soon: display name, society, privacy settings.</p>
      </div>
    </PageShell>
  );
}
