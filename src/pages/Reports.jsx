import { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/Sidebar";
import { getActivities } from "../services/activity.service";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { 
  FiFileText, FiDownload, FiBarChart2, FiShield, 
  FiAlertTriangle, FiCheckCircle, FiActivity, FiServer 
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

function Reports() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getActivities();
        setActivities(data || []);
      } catch (err) {
        toast.error("Telemetry bridge offline");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Document Header
      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42); // slate-900 equivalent
      doc.text("Identity Assurance & Forensics Report", 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleString()} | Adaptive Trust System`, 14, 30);
      
      // Summary Section
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("Activity Audit Trail", 14, 45);

      const tableData = activities.map(a => [
        a.employeeId,
        a.action,
        a.riskLevel || 'LOW',
        new Date(a.time).toLocaleString()
      ]);

      doc.autoTable({
        startY: 50,
        head: [['UID', 'Operation', 'Risk Index', 'Timestamp']],
        body: tableData,
        headStyles: { fillColor: [14, 165, 233] }, // security-500
        alternateRowStyles: { fillColor: [248, 250, 252] },
        theme: 'striped',
      });

      doc.save(`Security_Audit_${Date.now()}.pdf`);
      toast.success("PDF Dossier Generated");
    } catch (error) {
      console.error(error);
      toast.error("PDF generation aborted");
    }
  };

  const exportCSV = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(activities);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Telemetry");
      XLSX.writeFile(workbook, `Security_Telemetry_${Date.now()}.xlsx`);
      toast.success("CSV Spreadsheet Exported");
    } catch (error) {
      toast.error("Export failure");
    }
  };

  const stats = {
    total: activities.length,
    critical: activities.filter(a => a.riskLevel === 'CRITICAL').length,
    high: activities.filter(a => a.riskLevel === 'HIGH').length,
    normal: activities.filter(a => a.riskLevel === 'LOW' || !a.riskLevel).length,
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
                REPORTS <span className="text-security-500">& EXPORTS</span>
              </h1>
              <p className="text-slate-500 font-medium uppercase tracking-[0.3em] text-[10px] mt-1">
                Data Sovereignty & Compliance Archive
              </p>
            </div>
          </div>

          {/* Quick Intelligence Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <ReportStatCard label="Audit Records" value={stats.total} icon={<FiActivity />} color="security" />
            <ReportStatCard label="Critical Threats" value={stats.critical} icon={<FiAlertTriangle />} color="red" />
            <ReportStatCard label="High Risks" value={stats.high} icon={<FiShield />} color="orange" />
            <ReportStatCard label="Resolved" value={stats.normal} icon={<FiCheckCircle />} color="emerald" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Export Section */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl"
            >
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-security-500/10 rounded-2xl flex items-center justify-center text-3xl text-security-500">
                    <FiDownload />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white leading-tight">Data <br /> Export</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Portable Compliance Logs</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <ExportButton 
                    label="Download Forensic Dossier" 
                    icon={<FiFileText />} 
                    sub="Portable PDF with audit logs" 
                    onClick={exportPDF} 
                    color="bg-security-600"
                  />
                  <ExportButton 
                    label="Export Raw Telemetry" 
                    icon={<FiServer />} 
                    sub="CSV/Excel compatible data" 
                    onClick={exportCSV} 
                    color="bg-slate-800"
                  />
               </div>
            </motion.div>

            {/* AI Insights Concept */}
            <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-security-500/5 rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover:bg-security-500/10"></div>
               
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-3xl text-purple-500">
                    <FiBarChart2 />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-400">Intelligence <br /> Engine</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">AI-Derived Risk Analysis</p>
                  </div>
               </div>
               
               <div className="p-6 bg-slate-950/50 rounded-3xl border border-white/5">
                  <div className="flex flex-col gap-4">
                     <p className="text-xs text-slate-400 leading-relaxed italic">
                        "Current behavioral patterns across the organization indicate a <span className="text-emerald-500 font-bold">94.2% Stability Rating</span>. No mass-unauthorized access trends detected in the last 24 hours."
                     </p>
                     <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-security-500" style={{ width: '94%' }}></div>
                     </div>
                  </div>
               </div>
               
               <button className="mt-8 w-full py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">
                 Generate Insight Report
               </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ReportStatCard({ label, value, icon, color }) {
  const colorMap = {
    security: 'text-security-500 bg-security-500/10',
    red: 'text-red-500 bg-red-500/10',
    orange: 'text-orange-500 bg-orange-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10'
  };

  return (
    <div className="bg-slate-900/40 p-8 rounded-3xl border border-white/5 backdrop-blur-xl">
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-6 ${colorMap[color]}`}>
          {icon}
       </div>
       <h4 className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">{label}</h4>
       <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
    </div>
  );
}

function ExportButton({ label, icon, sub, onClick, color }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full p-6 rounded-3xl ${color} hover:brightness-110 transition-all flex items-center gap-5 text-left border border-white/5 relative group`}
    >
       <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl text-white">
          {icon}
       </div>
       <div>
          <h4 className="font-bold text-white leading-none">{label}</h4>
          <p className="text-[10px] uppercase font-black text-white/50 tracking-widest mt-2">{sub}</p>
       </div>
    </button>
  );
}

export default Reports;
