import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginUser, verifyBiometric } from "../../services/auth.service";
import { Toaster, toast } from "react-hot-toast";
import { FiShield, FiUser, FiLock, FiTerminal, FiCamera, FiActivity } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";

function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // MFA States
  const [mfaRequired, setMfaRequired] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleInitialLogin = async (e) => {
    e.preventDefault();

    if (!employeeId || !password) {
      toast.error("Credentials required for uplink");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(employeeId, password);

      if (!data) {
        toast.error("Handshake failed: Invalid credentials");
        return;
      }

      // Check if Biometric MFA is required
      if (data.mfaRequired) {
        toast.success("Credentials Verified. Biometric handshake required.");
        setMfaRequired(true);
        return;
      }

      // Direct login if no MFA enrolled
      finalizeLogin(data);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Authentication transmission error");
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricVerify = useCallback(async () => {
    if (!webcamRef.current) {
      toast.error("Biometric sensor not initialized");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    
    if (!imageSrc) {
      toast.error("Failed to capture biometric frame. Please ensure camera access.");
      return;
    }

    setCapturedImage(imageSrc);
    setIsScanning(true);

    try {
      // Simulate cryptographic processing time
      await new Promise(r => setTimeout(r, 1000));
      
      const data = await verifyBiometric(employeeId, imageSrc);

      if (data?.success && data?.token) {
        toast.success("Biometric Match Confirmed. Session Authorized.");
        setTimeout(() => finalizeLogin(data), 1500);
      } else {
        toast.error(data?.message || "Biometric mismatch: Identity not verified");
        setCapturedImage(null);
      }
    } catch (error) {
      console.error("MFA Error:", error);
      toast.error("Verification failed: Infrastructure error");
      setCapturedImage(null);
    } finally {
      setIsScanning(false);
    }
  }, [webcamRef, employeeId]);

  const finalizeLogin = (data) => {
    login({
      token: data.token,
      employeeId: data.employeeId,
      role: data.role,
      position: data.user?.position,
      trustScore: data.user?.trustScore,
      riskLevel: data.user?.riskLevel,
      name: data.user?.name,
      department: data.user?.department
    });

    navigate("/dashboard", { replace: true });

    // Open company portal
    setTimeout(() => {
      window.open(
        `http://localhost:5173/login?monitoringSession=true&empId=${data.employeeId}`,
        "_blank"
      );
    }, 500);
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
      
      {/* Abstract Background Noise */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-security-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-security-700/10 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-security-500 to-transparent"></div>
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-security-600/20 text-security-400 rounded-2xl mb-4 cyber-border">
              <FiShield className="text-3xl" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase leading-none">
              Security <span className="text-security-500 font-black">Uplink</span>
            </h1>
            <p className="text-slate-500 text-[10px] mt-2 font-black tracking-widest uppercase italic">Adaptive Personnel Authentication</p>
          </div>

          <AnimatePresence mode="wait">
            {!mfaRequired ? (
              <motion.form 
                key="password-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleInitialLogin} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Terminal UID</label>
                  <div className="relative group">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-security-400 transition-colors" />
                    <input
                      type="text"
                      placeholder="EMP-XXXX Identifier"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-security-500/50 transition-all font-bold text-sm placeholder:text-slate-700"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Protocol</label>
                  <div className="relative group">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-security-400 transition-colors" />
                    <input
                      type="password"
                      placeholder="Secure Cipher Key"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-security-500/50 transition-all font-bold text-sm placeholder:text-slate-700"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-security-600 hover:bg-security-500 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-security-900/40 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <FiTerminal className="animate-spin" /> : "Authorize Uplink"}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="biometric-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="relative mx-auto w-56 h-56 rounded-full overflow-hidden border-4 border-security-500/30">
                  {isScanning && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                       <div className="w-full h-1 bg-security-500 shadow-[0_0_20px_rgba(14,165,233,0.8)] animate-scan-line"></div>
                    </div>
                  )}
                  
                  {capturedImage ? (
                    <img src={capturedImage} alt="Capture" className="w-full h-full object-cover grayscale brightness-125" />
                  ) : (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2">Biometric Verification</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                     Hardware challenge active. <br /> Present authorized facial data.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleBiometricVerify}
                    disabled={isScanning}
                    className="w-full bg-security-600 hover:bg-security-500 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-security-900/40 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isScanning ? <FiActivity className="animate-pulse" /> : <><FiCamera /> Initialize Scan</>}
                  </button>
                  <button
                    onClick={() => setMfaRequired(false)}
                    className="text-[10px] font-black text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-colors"
                  >
                    Cancel Authentication
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 text-center border-t border-white/5 pt-8">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Unregistered identity?{" "}
              <Link to="/register" className="text-security-500 hover:underline decoration-dotted decoration-2 underline-offset-4">
                Enroll New Personnel
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

export default Login;
