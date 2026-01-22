type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Log action", href: "/log" },
  { label: "Challenges", href: "/challenges" },
  { label: "Society", href: "/society" },
  // later: { label: "Moderation", href: "/moderation" },
];

export default function Sidebar() {
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
      <div className="mt-auto rounded-2xl border border-gray-100 bg-white p-4">
        <div className="text-xs font-medium text-gray-900">Weekly goal</div>
        <div className="mt-1 text-xs text-gray-600">
          Log 3 actions to keep your streak.
        </div>
      </div>
    </aside>
  );
}
