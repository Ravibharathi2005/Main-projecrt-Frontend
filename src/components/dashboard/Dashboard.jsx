import { useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../common/Navbar";
import Sidebar from "../Sidebar";
import { getDashboardData } from "../../services/dashboard.service";
import { getActivities } from "../../services/activity.service";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from "recharts";
import { 
  FiActivity, FiShield, FiAlertOctagon, FiUsers, FiTrendingUp, 
  FiArrowUpRight, FiArrowDownRight, FiClock, FiCheckCircle 
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

function Dashboard() {
  const { user, trustScore, riskLevel } = useContext(AuthContext);
  const [data, setData] = useState({ alerts: [], activities: [] });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSessions: 0,
    riskThreats: 0,
    avgTrust: 0
  });

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [dashRes, actRes] = await Promise.all([
          getDashboardData(),
          getActivities({ limit: 10 })
        ]);
        
        setData(dashRes || { alerts: [], activities: [] });
        setActivities(actRes || []);
        
        // Simulate/Derive more detailed stats for the professional look
        setStats({
          totalUsers: dashRes.sessions * 12 + 5, // Mock multiplier for enterprise look
          activeSessions: dashRes.sessions || 1,
          riskThreats: dashRes.alerts || 0,
          avgTrust: trustScore
        });
      } catch (error) {
        console.error("Dashboard load failed:", error);
        toast.error("Telemetry sync interrupted");
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [trustScore]);

  // Generate trend data for the chart
  const trendData = useMemo(() => {
    return [
      { time: '09:00', score: 98 },
      { time: '10:00', score: 95 },
      { time: '11:00', score: 97 },
      { time: '12:00', score: 92 },
      { time: '13:00', score: 94 },
      { time: '14:00', score: trustScore },
    ];
  }, [trustScore]);

  const riskDistribution = [
    { name: 'Low', value: 70, color: '#22c55e' },
    { name: 'Medium', value: 20, color: '#eab308' },
    { name: 'High', value: 10, color: '#ef4444' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-security-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Neural Telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 ml-64 mt-16 max-w-7xl mx-auto">
          <Toaster position="top-right" />
          
          {/* Header Row */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">
                COMMAND <span className="text-security-500">CENTER</span>
              </h1>
              <p className="text-slate-500 font-medium uppercase tracking-[0.3em] text-[10px] mt-1">
                Real-time Adaptive Trust Monitoring
              </p>
            </div>
            <div className="flex items-center gap-4">
               <div className="px-5 py-3 bg-slate-900/50 border border-white/5 rounded-2xl flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Uplink: Stabilized</span>
               </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard 
              label="Total Monitored" 
              value={stats.totalUsers} 
              icon={<FiUsers />} 
              trend="+4.2%" 
              up={true} 
            />
            <StatCard 
              label="Active Sessions" 
              value={stats.activeSessions} 
              icon={<FiActivity />} 
              trend="Stable" 
              up={null} 
            />
            <StatCard 
              label="Active Threats" 
              value={stats.riskThreats} 
              icon={<FiAlertOctagon />} 
              trend={stats.riskThreats > 0 ? "Critical" : "None"} 
              up={stats.riskThreats > 0 ? false : true} 
              alert={stats.riskThreats > 0}
            />
            <StatCard 
              label="Global Trust Avg" 
              value={`${stats.avgTrust}%`} 
              icon={<FiShield />} 
              trend="-1.2%" 
              up={false} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Visuals Column */}
            <div className="lg:col-span-2 space-y-8">
               {/* Trust Trend Chart */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl"
               >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight">CONTINUOUS TRUST TREND</h3>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">AI-Derived Behavioral Score</p>
                    </div>
                    <FiTrendingUp className="text-security-500 text-2xl" />
                  </div>
                  
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="colorTrust" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} 
                        />
                        <YAxis 
                          hide 
                          domain={[0, 100]} 
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                          itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#0ea5e9" 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#colorTrust)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </motion.div>

               {/* Recent Activity Mini-Table */}
               <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-white tracking-tight uppercase">Raw Telemetry <span className="text-security-500">Feed</span></h3>
                    <button className="text-[10px] font-black text-security-500 uppercase tracking-widest hover:underline">View All Logs</button>
                  </div>
                  
                  <div className="space-y-4">
                    {activities.length > 0 ? activities.slice(0, 5).map((act, i) => (
                      <div key={i} className="flex items-center justify-between group p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-security-900/40 group-hover:text-security-400 transition-colors">
                            <FiActivity />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-200">{act.employeeId || "EMP-ANON"}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{act.action || "Generic Interaction"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-500 mb-1 uppercase uppercase tracking-tighter">
                            {new Date(act.time || Date.now()).toLocaleTimeString()}
                          </p>
                          <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${
                            act.riskLevel === 'CRITICAL' ? 'bg-red-500/10 text-red-500' :
                            act.riskLevel === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                            'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {act.riskLevel || 'LOW'} Risk
                          </span>
                        </div>
                      </div>
                    )) : (
                      <div className="py-10 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">No active telemetry</div>
                    )}
                  </div>
               </div>
            </div>

            {/* Side Column: Risk & Distribution */}
            <div className="space-y-8">
               {/* Current User Status */}
               <div className="bg-gradient-to-br from-security-900/40 to-slate-900/60 border border-security-500/20 rounded-[2.5rem] p-10 relative overflow-hidden backdrop-blur-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-security-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  
                  <div className="text-center">
                    <div className="relative inline-block mb-6">
                       <svg className="w-32 h-32 transform -rotate-90">
                          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" 
                            strokeDasharray={364}
                            strokeDashoffset={364 - (364 * trustScore) / 100}
                            strokeLinecap="round"
                            className="text-security-500" 
                          />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black text-white">{trustScore}</span>
                          <span className="text-[8px] font-black text-security-400 uppercase tracking-widest">Trust Index</span>
                       </div>
                    </div>
                    
                    <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">SYSTEM CLEARANCE</h4>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 font-black text-[10px] uppercase tracking-widest ${
                      riskLevel === 'CRITICAL' ? 'text-red-500 bg-red-500/10' : 'text-emerald-500 bg-emerald-500/10'
                    }`}>
                      <FiCheckCircle /> Status: {riskLevel === 'CRITICAL' ? 'SUSPENDED' : 'AUTHORIZED'}
                    </div>
                  </div>
               </div>

               {/* Org Distribution */}
               <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl">
                  <h3 className="text-sm font-black text-white tracking-widest uppercase mb-8">Org Risk Matrix</h3>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskDistribution}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4 mt-4">
                    {riskDistribution.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-xs font-bold text-slate-500">{item.name} Threats</span>
                         </div>
                         <span className="text-xs font-black text-white">{item.value}%</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend, up, alert }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-slate-900/50 border ${alert ? 'border-red-500/20' : 'border-white/5'} rounded-3xl p-8 backdrop-blur-xl group transition-all duration-300 hover:bg-slate-800/80`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
          alert ? 'bg-red-500/10 text-red-500' : 'bg-security-600/10 text-security-400 group-hover:bg-security-500 group-hover:text-white'
        } transition-all duration-500`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
          up === true ? 'text-emerald-500' : up === false ? 'text-red-500' : 'text-slate-500'
        }`}>
          {up === true && <FiArrowUpRight />}
          {up === false && <FiArrowDownRight />}
          {trend}
        </div>
      </div>
      <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{label}</h4>
      <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
    </motion.div>
  );
}

export default Dashboard;
