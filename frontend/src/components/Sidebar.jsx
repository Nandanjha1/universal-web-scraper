import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: "📊",
  },
  {
    name: "Scrape Website",
    path: "/scrape",
    icon: "🌐",
  },
  {
    name: "Scraped Data",
    path: "/data",
    icon: "🗃️",
  },
  {
    name: "Database Schema",
    path: "/schema",
    icon: "🛠️",
  },
];

function Sidebar() {
  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] border-r bg-gray-900 text-white">
      <div className="p-4">
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
          Navigation
        </p>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
