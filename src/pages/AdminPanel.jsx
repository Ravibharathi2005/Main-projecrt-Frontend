import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/Sidebar";
import { getAllUsers, updateUserRole } from "../services/user.service";
import { 
  FiUser, FiShield, FiEdit2, FiSearch, 
  FiCheckCircle, FiAlertCircle, FiSettings, FiActivity 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Handshake with registry failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success("Identity Permissions Updated");
      setEditingUser(null);
    } catch (err) {
      toast.error("Authorization update failed");
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'ADMIN': return 'bg-security-500/10 text-security-400 border-security-500/20';
      case 'HR': return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      case 'MANAGER': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'SECURITY_ANALYST': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 ml-64 mt-16 max-w-7xl mx-auto">
          <Toaster position="top-right" />
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">
                IDENTITY <span className="text-security-500">REGISTRY</span>
              </h1>
              <p className="text-slate-500 font-medium uppercase tracking-[0.3em] text-[10px] mt-1">
                Management of Authorization Vectors & Access Tiers
              </p>
            </div>
            <div className="flex items-center gap-4">
               <div className="px-5 py-3 bg-slate-900/50 border border-white/5 rounded-2xl flex items-center gap-3">
                  <FiSettings className="text-security-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Governance Mode Active</span>
               </div>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-4 mb-8">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search Identity Registry (UID, Name, Role)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-security-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
             <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Personnel</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tier / Role</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Behavioral Score</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-security-500 group-hover:text-white transition-all duration-300">
                             <FiUser className="text-xl" />
                           </div>
                           <div>
                             <p className="text-base font-bold text-white">{u.name || "UNIDENTIFIED"}</p>
                             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{u.employeeId}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest ${getRoleBadgeStyle(u.role)}`}>
                            {u.role || 'PENDING'}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col items-center gap-2">
                            <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                               <div 
                                 className={`h-full transition-all duration-1000 ${
                                   (u.trustScore || 100) > 80 ? 'bg-security-500' : 
                                   (u.trustScore || 100) > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                 }`}
                                 style={{ width: `${u.trustScore || 100}%` }}
                               ></div>
                            </div>
                            <span className="text-[10px] font-black text-slate-500">{u.trustScore || 100}% Stability</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button 
                           onClick={() => setEditingUser(u)}
                           className="p-3 bg-slate-800 hover:bg-security-600 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
                         >
                           <FiEdit2 />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
             
             {!loading && filteredUsers.length === 0 && (
                <div className="py-20 text-center">
                   <FiActivity className="text-5xl text-slate-800 mx-auto mb-4" />
                   <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Identity mismatch: No records found</p>
                </div>
             )}
          </div>
        </main>
      </div>

      {/* Role Edit Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-950/40">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-security-500/30 rounded-[2.5rem] p-10 max-w-sm w-full shadow-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-security-500 to-transparent"></div>
              
              <h2 className="text-2xl font-black text-white tracking-tighter mb-2">UPDATE <span className="text-security-500">TIER</span></h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">Modifying authorization for {editingUser.employeeId}</p>
              
              <div className="space-y-3 mb-10">
                {['EMPLOYEE', 'MANAGER', 'HR', 'SECURITY_ANALYST', 'ADMIN', 'SUPER_ADMIN'].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleUpdate(editingUser._id, role)}
                    className={`w-full py-4 px-6 rounded-2xl text-left font-bold text-sm transition-all flex items-center justify-between group ${
                      editingUser.role === role ? 'bg-security-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {role}
                    {editingUser.role === role && <FiCheckCircle />}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setEditingUser(null)}
                className="w-full text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                Cancel Modification
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminPanel;
