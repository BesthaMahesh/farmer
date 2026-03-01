import { useState, useEffect } from 'react';
import { Mail, Lock, Phone, ArrowRight, Loader2, Grape, Smartphone, Eye, EyeOff, Shield } from 'lucide-react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signInWithPhoneNumber
} from 'firebase/auth';
import { auth, googleProvider, setupRecaptcha } from '../firebase';

const Login = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [authMethod, setAuthMethod] = useState('email'); // email, phone

    // Email Auth States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Phone Auth States
    const [phoneNumber, setPhoneNumber] = useState('+91');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize invisible recaptcha for phone auth
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = setupRecaptcha('recaptcha-container');
        }
    }, []);

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                onLogin(userCredential.user);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                onLogin(userCredential.user);
            }
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            onLogin(result.user);
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
            setConfirmationResult(result);
            setOtpSent(true);
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await confirmationResult.confirm(otp);
            onLogin(result.user);
        } catch (err) {
            setError("Invalid OTP. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">

            {/* Dark Navy Background Gradients */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-green-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-emerald-500/10 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4"></div>

            <div className="z-10 w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Logo & Heading */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-green-500/20">
                        <Grape className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white text-center tracking-tight mb-2">
                        {isLogin ? 'Welcome Back to AgroMind' : 'Join AgroMind Today'}
                    </h1>
                    <p className="text-slate-400 font-medium text-center text-sm">
                        {isLogin ? 'Secure access to your analytics & AI advisor.' : 'Your AI-powered farm intelligence platform.'}
                    </p>
                </div>

                {/* Glassmorphism Card */}
                <div
                    className="relative rounded-3xl p-8"
                    style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                >
                    <div id="recaptcha-container"></div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold flex items-center animate-in fade-in">
                            <span className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-3 shrink-0">!</span>
                            {error}
                        </div>
                    )}

                    {/* Pill Toggle Tabs */}
                    <div className="flex bg-slate-900/50 p-1.5 rounded-2xl mb-8 border border-slate-800">
                        <button
                            onClick={() => setAuthMethod('email')}
                            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2 ${authMethod === 'email' ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <Mail size={16} /> Email
                        </button>
                        <button
                            onClick={() => { setAuthMethod('phone'); setError(''); }}
                            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2 ${authMethod === 'phone' ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <Smartphone size={16} /> Phone
                        </button>
                    </div>

                    {/* Email/Password Form */}
                    {authMethod === 'email' && (
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                                        <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-green-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-11 pr-4 text-white font-medium focus:bg-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-slate-600"
                                        placeholder="farmer@agromind.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 mt-5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 flex justify-between">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-green-500 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-11 pr-12 text-white font-medium focus:bg-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-slate-600"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Options Row */}
                            <div className="flex items-center justify-between mt-4 mb-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900/50 text-green-500 focus:ring-green-500 focus:ring-offset-slate-950" />
                                    <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                                </label>
                                {isLogin && (
                                    <a href="#" className="text-xs font-medium text-green-500 hover:text-green-400 transition-colors">Forgot password?</a>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !email || !password}
                                className="w-full bg-white hover:bg-slate-100 text-slate-900 rounded-xl py-3.5 mt-6 font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 disabled:hover:bg-white group"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : (
                                    <>
                                        {isLogin ? 'Sign In Securely' : 'Create Account'}
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Phone Number Auth Block */}
                    {authMethod === 'phone' && (
                        <div className="space-y-4">
                            {!otpSent ? (
                                <form onSubmit={handleSendOTP}>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Mobile Number</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-slate-500 group-focus-within:text-green-500 transition-colors" />
                                            </div>
                                            <input
                                                type="tel"
                                                required
                                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-11 pr-4 text-white font-medium focus:bg-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-slate-600"
                                                placeholder="+91 98765 43210"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || phoneNumber.length < 5}
                                        className="w-full bg-white hover:bg-slate-100 text-slate-900 rounded-xl py-3.5 mt-6 font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send OTP via SMS'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOTP} className="animate-in slide-in-from-right-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 text-center w-full block">Enter 6-Digit OTP</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3.5 px-4 text-center text-2xl tracking-widest text-white font-black focus:bg-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-slate-700"
                                            placeholder="------"
                                            maxLength="6"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || otp.length < 6}
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white rounded-xl py-3.5 mt-6 font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify & Login'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Standard Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                            <span className="bg-slate-950 px-4 text-slate-500">Or</span>
                        </div>
                    </div>

                    {/* Google OAuth Button */}
                    <button
                        onClick={handleGoogleAuth}
                        disabled={loading}
                        className="w-full bg-[#1a1c23] border border-slate-800 hover:bg-[#20222b] text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-3 transition-colors shadow-sm disabled:opacity-50 group"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Toggle Auth Trigger */}
                    {authMethod === 'email' && (
                        <p className="mt-8 text-center text-sm font-medium text-slate-500">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="font-bold text-green-500 hover:text-green-400 hover:underline px-1 transition-colors"
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    )}
                </div>

                {/* Trust Indicators */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-slate-600" />
                        <span>Secured with Firebase Auth</span>
                    </div>
                    <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-slate-600" />
                        <span>256-bit encrypted sessions</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
