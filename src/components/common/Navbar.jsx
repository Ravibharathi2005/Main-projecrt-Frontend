import { useAuth } from "../../context/AuthContext";
import { FiShield, FiBell, FiSettings, FiActivity } from "react-icons/fi";

function Navbar() {
  const { user, trustScore, riskLevel } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-slate-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-50">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-security-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-security-900/40">
             <FiShield className="text-xl" />
          </div>
          <span className="text-lg font-black tracking-tighter text-white">GUARDIAN<span className="text-security-500 font-black">AI</span></span>
        </div>

        <div className="hidden lg:flex items-center gap-8">
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Stability</span>
              <div className="flex items-center gap-2">
                 <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-security-500" style={{ width: '92%' }}></div>
                 </div>
                 <span className="text-[10px] font-black text-security-400">92%</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl border border-white/5">
           <FiActivity className="text-security-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Telemetry Live</span>
        </div>

        <div className="flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
           <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-white leading-none">{user?.name || "Root Admin"}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">{user?.role || "SYSTEM"}</p>
           </div>
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-security-500 to-security-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-security-900/30">
              {user?.name?.charAt(0) || user?.employeeId?.charAt(0) || "A"}
           </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;