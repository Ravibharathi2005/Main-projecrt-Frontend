import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/Sidebar";
import { 
  FiUser, FiMail, FiMapPin, FiBriefcase, 
  FiLayers, FiShield, FiCpu, FiActivity 
} from "react-icons/fi";
import { motion } from "framer-motion";

function Profile() {
  const { user, trustScore, riskLevel } = useAuth();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData(user);
    }
  }, [user]);

  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 ml-64 mt-16 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                Personnel <span className="text-security-500">Dossier</span>
              </h1>
              <p className="text-slate-500 font-medium uppercase tracking-[0.3em] text-[10px] mt-1">
                Authorized Identity Data & Trust Profile
              </p>
            </div>
            <div className="px-5 py-3 bg-slate-900/50 border border-white/5 rounded-2xl flex items-center gap-3">
              <FiShield className="text-security-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified Identity</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-security-500 to-transparent"></div>
                
                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-security-500 to-security-700 mx-auto mb-6 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-security-900/40 border-4 border-white/10 ring-4 ring-security-500/10">
                  {profileData.name?.charAt(0) || profileData.employeeId?.charAt(0) || "U"}
                </div>
                
                <h2 className="text-2xl font-black text-white tracking-tighter leading-tight mb-1">{profileData.name || "UNIDENTIFIED"}</h2>
                <p className="text-security-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">{profileData.employeeId}</p>
                
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest ${
                  profileData.role === 'ADMIN' ? 'bg-security-500/10 text-security-400 border-security-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {profileData.role || "SYSTEM_GUEST"}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl"
              >
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4 px-2">Assurance Metrics</h3>
                <div className="space-y-6 px-2">
                   <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                         <span className="text-slate-400">Trust Stability</span>
                         <span className="text-security-400">{trustScore}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${trustScore}%` }}
                           className="h-full bg-security-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                         ></motion.div>
                      </div>
                   </div>
                   
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Tiers</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${
                        riskLevel === 'LOW' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                         {riskLevel}
                      </span>
                   </div>
                </div>
              </motion.div>
            </div>

            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl"
              >
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-xl text-security-500">
                      <FiCpu />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-white tracking-tight uppercase leading-none">Identity Vectors</h3>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 px-0.5">Core Personnel Metadata</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <DetailRow icon={<FiUser />} label="Full Identity" value={profileData.name} />
                   <DetailRow icon={<FiLayers />} label="Organization Unit" value={profileData.department || "Operations"} />
                   <DetailRow icon={<FiBriefcase />} label="Personnel Tier" value={profileData.position || "Staff"} />
                   <DetailRow icon={<FiMapPin />} label="Assigned Location" value={profileData.location || "Remote / Global"} />
                   <DetailRow icon={<FiMail />} label="Secure Relay" value={profileData.email || `${profileData.employeeId}@guardian.ai`} />
                   <DetailRow icon={<FiActivity />} label="Uplink ID" value={profileData.employeeId} />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl relative group overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-64 h-64 bg-security-500/5 rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover:bg-security-500/10"></div>
                 
                 <div className="flex gap-6 mb-8">
                    <div className="w-12 h-12 bg-security-500/10 border border-security-500/10 rounded-2xl flex items-center justify-center text-2xl text-security-500">
                       <FiShield />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight leading-none">Security Clearance</h3>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Active Privileges & Tiers</p>
                    </div>
                 </div>

                 <div className="p-8 bg-slate-950/50 rounded-3xl border border-white/5">
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      "Access level <span className="text-security-500 font-bold">{profileData.role}</span> granted for session token encryption. Continuous trust monitoring is active for this identity. Maintain operational stability."
                    </p>
                 </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/5 group hover:bg-white/5 transition-all">
       <div className="flex items-center gap-4 mb-3">
          <div className="text-security-500 text-lg opacity-50 group-hover:opacity-100 transition-opacity">
            {icon}
          </div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">{label}</span>
       </div>
       <p className="text-sm font-bold text-white px-0.5">{value || "NOT_DEFINED"}</p>
    </div>
  );
}

export default Profile;