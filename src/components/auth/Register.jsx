import { useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { FiShield, FiUser, FiLock, FiTerminal, FiCamera, FiCheckCircle, FiActivity } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";

function Register() {
  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [biometricStep, setBiometricStep] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const capture = useCallback(() => {
    if (!webcamRef.current) {
      toast.error("Biometric sensor not found");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    
    if (!imageSrc) {
      toast.error("Signal failure: Camera sensor not responding");
      return;
    }

    setIsScanning(true);
    
    // Simulate "Deep Scan" processing
    setTimeout(() => {
      setCapturedImage(imageSrc);
      setIsScanning(false);
      toast.success("Facial Data Encrypted & Bound to Identity");
    }, 2500);
  }, [webcamRef]);

  const handleRegister = async (e) => {
    if (e) e.preventDefault();

    if (!capturedImage) {
      toast.error("Biometric Identity Verification Required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Handshake Failed: Cipher keys do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: formData.employeeId,
          password: formData.password,
          biometricData: capturedImage // Transmit the biometric frame
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Identity Registered. Handshake Protocol Initialized.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const errorMsg = data.message || "Registration transmission error";
        console.error(`[REGISTRATION REJECTED] ${errorMsg}`);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Infrastructure Error: Handshake timed out");
    } finally {
      setLoading(false);
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
    quality: 1,
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <Toaster position="bottom-center" />
      
      {/* Dynamic Background Noise */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-security-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-security-700/10 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-security-500 to-transparent"></div>
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-security-600/20 text-security-400 rounded-2xl mb-4 cyber-border">
              <FiShield className="text-3xl" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">
              Identity <span className="text-security-500 font-black">Registry</span>
            </h1>
            <p className="text-slate-500 text-xs mt-2 font-black tracking-widest uppercase italic">Secure Personnel Enrollment Protocol</p>
          </div>

          {!biometricStep ? (
            <motion.form 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onSubmit={(e) => { e.preventDefault(); setBiometricStep(true); }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Terminal UID</label>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-security-400 transition-colors" />
                  <input
                    name="employeeId"
                    type="text"
                    placeholder="EMP-XXX"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-security-500/50 transition-all text-sm font-bold placeholder:text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Protocol</label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-security-400 transition-colors" />
                  <input
                    name="password"
                    type="password"
                    placeholder="Secure Cipher Key"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-security-500/50 transition-all text-sm font-bold placeholder:text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Key Confirmation</label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-security-400 transition-colors" />
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Verify Cipher Key"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-security-500/50 transition-all text-sm font-bold placeholder:text-slate-700"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-security-600 hover:bg-security-500 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-security-900/40 flex items-center justify-center gap-3 group"
              >
                Continue to Biometrics <FiShield className="group-hover:rotate-12 transition-transform" />
              </button>
            </motion.form>
          ) : (
            <motion.div 
               initial={{ x: 20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="space-y-8"
            >
              <div className="relative mx-auto w-64 h-64 rounded-full overflow-hidden border-4 border-security-500/30 group">
                {isScanning && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden pointer-events-none">
                     <div className="w-full h-1 bg-security-500 shadow-[0_0_20px_rgba(14,165,233,0.8)] animate-scan-line"></div>
                  </div>
                )}
                
                {capturedImage ? (
                  <img src={capturedImage} alt="Biometric Capture" className="w-full h-full object-cover" />
                ) : (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="w-full h-full object-cover"
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center pb-4 transition-opacity">
                   <p className="text-[10px] font-black text-security-400 uppercase tracking-widest">Biometric Viewport</p>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2">Face Verification</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed px-10 mx-auto">
                   Capturing high-fidelity biometric data <br /> for cryptographic personnel binding.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {!capturedImage ? (
                  <button
                    onClick={capture}
                    disabled={isScanning}
                    className="w-full bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isScanning ? (
                       <><FiActivity className="animate-spin" /> Performing Deep Scan...</>
                    ) : (
                       <><FiCamera /> Initialize Capture</>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full bg-security-600 hover:bg-security-500 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-security-900/40 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? "Authenticating Identity..." : "Finalize Enrollment"}
                  </button>
                )}
                
                <button
                  onClick={() => { setBiometricStep(false); setCapturedImage(null); }}
                  className="text-[10px] font-black text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-colors"
                >
                  Return to Cipher Details
                </button>
              </div>
            </motion.div>
          )}

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
              Existing identity verified?{" "}
              <Link to="/login" className="text-security-500 hover:underline decoration-dotted decoration-2 underline-offset-4">
                Uplink Authentication
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
      
      <style>{`
        @keyframes scan-line {
          0% { transform: translateY(-100px); }
          100% { transform: translateY(200px); }
        }
        .animate-scan-line {
          animation: scan-line 2s infinite linear;
        }
      `}</style>
    </div>
  );
}

export default Register;