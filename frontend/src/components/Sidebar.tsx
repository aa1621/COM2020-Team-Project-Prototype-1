type NavItem = {
  label: string;
  href: string;
};

const navItems = [
  { label: "Dashboard", href: "/app/dashboard" },
  { label: "Groups", href: "/app/groups" },
  { label: "Challenges", href: "/app/challenges" },
  { label: "Log action", href: "/app/log-action" },
  { label: "Leaderboards", href: "/app/leaderboards" },
  { label: "Profile", href: "/app/profile" },
];


export default function Sidebar() {
  function handleLogout() {
    localStorage.removeItem("demo_user");
    window.location.href = "/login";
  }

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:gap-6 md:border-r md:border-gray-100 md:bg-white/70 md:p-6">
      {/* Brand */}
      <div className="space-y-1">
        <div className="text-sm font-semibold text-gray-900">Campus Carbon</div>
        <div className="text-xs text-gray-500">Exeter student challenges</div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Bottom area */}
      <div className="mt-auto space-y-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="text-xs font-medium text-gray-900">Weekly goal</div>
          <div className="mt-1 text-xs text-gray-600">
            Log 3 actions to keep your streak.
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
