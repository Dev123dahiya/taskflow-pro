import {
  ArrowRightOnRectangleIcon,
  ClipboardDocumentCheckIcon,
  FolderIcon,
  Squares2X2Icon
} from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Squares2X2Icon },
  { to: "/projects", label: "Projects", icon: FolderIcon },
  { to: "/tasks", label: "Tasks", icon: ClipboardDocumentCheckIcon }
];

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col px-4 py-4">
        <div className="mb-4">
          <div className="text-lg font-bold text-slate-950">Team Task Manager</div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{user?.role}</div>
        </div>

        <nav className="grid grid-cols-3 gap-2 lg:grid-cols-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition lg:justify-start ${
                  isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 lg:mt-auto">
          <div className="truncate text-sm font-semibold text-slate-900">{user?.name}</div>
          <div className="truncate text-xs text-slate-500">{user?.email}</div>
          <button type="button" onClick={handleLogout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
