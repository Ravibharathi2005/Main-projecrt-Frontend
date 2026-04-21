import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/Sidebar";
import { getActivities } from "../services/activity.service";
import { 
  FiSearch, FiFilter, FiDownload, FiRefreshCw, 
  FiClock, FiMonitor, FiUser, FiShield, FiChevronLeft, FiChevronRight, FiActivity 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

function Monitoring() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getActivities();
      setActivities(data || []);
    } catch (error) {
      toast.error("Handshake failed with telemetry backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return activities.filter(log => {
      const matchesSearch = log.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           log.action?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === "ALL" || log.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [activities, searchTerm, riskFilter]);

  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, page]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const getRiskStyles = (level) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'HIGH': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
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
                TELEMETRY <span className="text-security-500">STREAM</span>
              </h1>
              <p className="text-slate-500 font-medium uppercase tracking-[0.3em] text-[10px] mt-1">
                Forensic Activity Monitoring & Audit Trail
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={fetchLogs}
                className="p-3 bg-slate-900 border border-white/5 rounded-xl hover:bg-slate-800 transition-all text-slate-400"
              >
                <FiRefreshCw className={loading ? "animate-spin" : ""} />
              </button>
              <button className="flex items-center gap-2 px-5 py-3 bg-security-600 hover:bg-security-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-security-900/20">
                <FiDownload /> Export
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-4 mb-8 flex flex-wrap items-center gap-6">
            <div className="flex-1 relative min-w-[300px]">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search Employee ID or Action..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-security-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Filter</span>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                {['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRiskFilter(r); setPage(1); }}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${
                      riskFilter === r ? 'bg-security-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Interaction</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trace Info</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Index</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {paginatedLogs.map((log, i) => (
                    <motion.tr 
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-security-500">
                            <FiUser />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{log.employeeId}</p>
                            <p className="text-[10px] text-slate-500 font-medium">Internal Staff</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-300 font-medium">
                          <FiActivity className="text-security-500" />
                          <span className="text-sm">{log.action || "Generic Interaction"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                            <FiMonitor /> {log.browser || "Agent"}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                            <FiShield /> {log.page || "N/A"} Page
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest ${getRiskStyles(log.riskLevel)}`}>
                          {log.riskLevel || 'LOW'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex flex-col items-end">
                           <div className="flex items-center gap-2 text-white font-bold text-xs">
                             <FiClock className="text-security-500" />
                             {new Date(log.time).toLocaleTimeString()}
                           </div>
                           <span className="text-[10px] text-slate-500 font-bold">{new Date(log.time).toLocaleDateString()}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            
            {filteredLogs.length === 0 && (
              <div className="py-20 text-center">
                <FiActivity className="text-5xl text-slate-800 mx-auto mb-4" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No matching telemetry found in the stream</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-3 bg-slate-900 border border-white/5 rounded-xl disabled:opacity-30 hover:bg-slate-800 transition-all"
              >
                <FiChevronLeft />
              </button>
              <div className="flex gap-2">
                 {[...Array(totalPages)].map((_, i) => (
                   <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                      page === i + 1 ? 'bg-security-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                    }`}
                   >
                     {i + 1}
                   </button>
                 ))}
              </div>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-3 bg-slate-900 border border-white/5 rounded-xl disabled:opacity-30 hover:bg-slate-800 transition-all"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Monitoring;
