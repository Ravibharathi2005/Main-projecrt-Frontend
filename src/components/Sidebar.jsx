import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  FiHome, FiShield, FiAlertTriangle, FiActivity, 
  FiUser, FiLogOut, FiBarChart2, FiSettings 
} from "react-icons/fi";
import { motion } from "framer-motion";

function Sidebar() {
  const { user, logout } = useAuth();

  const navItems = [
    { to: "/dashboard", label: "Operations", icon: FiHome },
    { to: "/monitoring", label: "Telemetry", icon: FiActivity },
    { to: "/reports", label: "Archives", icon: FiBarChart2 },
    { to: "/admin", label: "Identity", icon: FiShield, adminOnly: true },
    { to: "/profile", label: "Profile", icon: FiUser },
  ];

  return (
    <aside className="w-64 bg-slate-900/50 backdrop-blur-xl h-screen fixed left-0 top-0 border-r border-white/5 flex flex-col pt-24 z-40">
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item, idx) => {
          if (item.adminOnly && user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") return null;
          return (
            <NavLink
              key={idx}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-security-600 text-white shadow-lg shadow-security-900/20' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`text-xl transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-security-400'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/5 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl transition-all duration-300 text-[10px] font-black uppercase tracking-[0.2em] border border-red-500/10 hover:border-transparent group"
        >
          <FiLogOut className="text-lg transition-transform group-hover:-translate-x-1" />
          Terminate
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
