import { useState, useEffect } from 'react'
import axios from 'axios'
import {
    TrendingUp, CloudRain, Sun, Thermometer, MapPin, Activity, ShieldCheck,
    AlertCircle, Beaker, CheckCircle, Share2, Download, AlertTriangle,
    Calendar, PieChart, Server, DollarSign, Sprout, ChevronRight, Save, Bell, Landmark, Map, DownloadCloud, Zap
} from 'lucide-react'
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts'

// Mock Data
const weatherChartData = [
    { day: 'Mon', temp: 28, rain: 20 },
    { day: 'Tue', temp: 30, rain: 15 },
    { day: 'Wed', temp: 32, rain: 5 },
    { day: 'Thu', temp: 29, rain: 45 },
    { day: 'Fri', temp: 27, rain: 60 },
    { day: 'Sat', temp: 26, rain: 30 },
    { day: 'Sun', temp: 28, rain: 10 },
]

const priceData = [
    { month: 'Jan', price: 85000 },
    { month: 'Feb', price: 88000 },
    { month: 'Mar', price: 90000 },
    { month: 'Apr', price: 95000 },
    { month: 'May', price: 92000 },
    { month: 'Jun', price: 98000 },
]

const getSchemes = (state) => {
    const list = [
        { name: "PM-KISAN Samman Nidhi", desc: "₹6000/year income support", tag: "Central" },
        { name: "Pradhan Mantri Fasal Bima Yojana", desc: "Crop insurance against natural risks", tag: "Central" }
    ];
    if (state === "Andhra Pradesh") list.push({ name: "YSR Rythu Bharosa", desc: "Financial assistance to farmers", tag: "State" });
    if (state === "Telangana") list.push({ name: "Rythu Bandhu", desc: "Investment support for agriculture", tag: "State" });
    return list;
}

const Dashboard = ({ user, recommendation, lastDetection, history, setActiveTab }) => {
    const [weather, setWeather] = useState({ temp: 28, rainfall: 20, condition: 'Sunny', icon: '01d' })
    const [shareText, setShareText] = useState('Share')
    const [saveText, setSaveText] = useState('Save Plan')
    const [reminderText, setReminderText] = useState('Set Reminder')

    const schemes = getSchemes(recommendation?.state || "Andhra Pradesh");

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setShareText('Copied!');
        setTimeout(() => setShareText('Share'), 2000);
    };

    const handleAction = (setter, text, successText) => {
        setter(successText);
        setTimeout(() => setter(text), 2500);
    }

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // If we have auto-location we might use recommendation.inputs.city
                const city = recommendation?.inputs?.city || 'Nandyal';
                const res = await axios.get(`/api/weather?city=${city}`)
                setWeather(res.data)
            } catch (err) {
                console.error('Weather fetch failed', err)
            }
        }
        fetchWeather()
    }, [recommendation])

    const getOptimalAdjustments = (inputs) => {
        if (!inputs) return [];
        let adjustments = [];
        const n = Number(inputs.N);
        const p = Number(inputs.P);
        const k = Number(inputs.K);
        const ph = Number(inputs.ph);

        if (n < 40) adjustments.push(`Add ${Math.round((40 - n) * 1.5)}kg Urea per acre`);
        else if (n > 80) adjustments.push('Improve organic matter, reduce nitrogen fertilizer');

        if (p < 30) adjustments.push(`Add ${Math.round((30 - p) * 2)}kg DAP per acre`);

        if (ph > 7.5) adjustments.push(`Reduce pH from ${ph} → 6.5 using Elemental Sulfur or Gypsum`);
        else if (ph < 6.0) adjustments.push(`Increase pH from ${ph} → 6.5 using Agricultural Lime`);

        if (adjustments.length === 0) adjustments.push("Soil is optimal. Proceed with standard practices.");

        return adjustments.slice(0, 3);
    }

    const tips = getOptimalAdjustments(recommendation?.inputs);

    // Fallback info
    const isAdvanced = recommendation?.advancedMode;
    const confidenceScore = recommendation ? Math.round(recommendation.confidence * 100) : 0;
    const cropName = recommendation?.crop || 'No Data';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 print-container bg-[#f1f5f9]">

            {/* Header section w/ Export & Share buttons */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 flex items-center gap-3">
                        {isAdvanced ? <><Zap className="text-indigo-600 fill-indigo-600 w-8 h-8" /> Advanced AI Dashboard</> : (user?.displayName ? `Welcome back, ${user.displayName.split(' ')[0]}!` : 'Welcome back!')}
                    </h1>
                    <p className="text-slate-500 flex items-center gap-2 font-medium">
                        <MapPin className="w-4 h-4 text-green-600" />
                        {recommendation?.inputs?.city || 'Nandyal'}, {recommendation?.state || 'Andhra Pradesh'} • Today, {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleShare}
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm hover:shadow-md hidden print:hidden sm:flex"
                    >
                        <Share2 size={16} /> {shareText}
                    </button>
                    <button
                        onClick={handlePrint}
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm hover:shadow-md hidden print:hidden sm:flex"
                    >
                        <DownloadCloud size={16} /> PDF Report
                    </button>
                    <button
                        onClick={() => handleAction(setSaveText, 'Save Plan', 'Saved to Account!')}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm print:hidden"
                    >
                        <Save size={16} /> {saveText}
                    </button>
                </div>
            </header>

            {/* Smart Summary Header (Executive View) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 print:grid-cols-4">
                <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-all"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3.5 bg-green-50 text-green-600 rounded-2xl">
                            <Sprout className="w-6 h-6" />
                        </div>
                        <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">High</span>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1 relative z-10">AI Match Score</p>
                    <h3 className="text-4xl font-black text-slate-800 relative z-10 tracking-tight">{confidenceScore}%</h3>
                </div>

                <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">+12%</span>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1 relative z-10">Market Price Forecast</p>
                    <h3 className="text-4xl font-black text-slate-800 relative z-10 tracking-tight">₹95k<span className="text-xl text-slate-400 font-bold ml-1">/ac</span></h3>
                </div>

                <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">Ideal</span>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1 relative z-10">Risk Level</p>
                    <h3 className="text-3xl font-black text-slate-800 relative z-10 tracking-tight mt-1 text-emerald-600">Low Risk</h3>
                </div>

                <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
                            <CloudRain className="w-6 h-6" />
                        </div>
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">7 Days</span>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1 relative z-10">Weather Alert</p>
                    <h3 className="text-2xl font-black text-slate-800 relative z-10 tracking-tight mt-1.5">Expect 40mm Rain</h3>
                </div>
            </div>

            {/* Main AI Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Main Analysis) */}
                <div className="lg:col-span-2 space-y-8 flex flex-col">
                    <div className={`bg-white border rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl flex-1 ${isAdvanced ? 'border-indigo-200 shadow-indigo-200/50' : 'border-slate-200 shadow-slate-200/50'}`}>
                        {isAdvanced && <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>}

                        <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                            <TrendingUp size={280} className="text-green-600" />
                        </div>

                        {recommendation ? (
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg">
                                                <Activity className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{isAdvanced ? 'Primary AI Masterplan' : 'AI Crop Engine'}</h2>
                                        </div>
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Top Recommendation</p>
                                        <h3 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-400 capitalize tracking-tight" style={{ lineHeight: 1 }}>
                                            {cropName}
                                        </h3>
                                    </div>
                                    <div className="hidden md:block text-right self-end pb-2">
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-3">AI Confidence Meter</p>
                                        <div className="relative w-36 h-36 border-8 border-slate-100 rounded-full flex items-center justify-center shadow-inner">
                                            <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{ clipPath: `inset(${100 - confidenceScore}% 0 0 0)` }}></div>
                                            <div className="text-center">
                                                <span className="text-4xl font-black text-slate-800">{confidenceScore}%</span>
                                                <span className="block text-[10px] font-bold text-green-600 uppercase tracking-widest">High Match</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Actionable Suggestions Panel */}
                                    <div className="bg-orange-50/50 rounded-[2rem] p-8 border border-orange-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <Beaker className="w-6 h-6 text-orange-500" />
                                                <h4 className="font-bold text-slate-900 text-lg">Soil Correction Panel</h4>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1.5 rounded-lg">Action Required</span>
                                        </div>
                                        <ul className="space-y-4">
                                            {tips.map((tip, idx) => (
                                                <li key={idx} className="flex items-start gap-4">
                                                    <div className="w-6 h-6 bg-white border border-orange-200 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-black text-orange-500 shadow-sm">{idx + 1}</div>
                                                    <p className="text-slate-700 font-medium leading-snug">{tip}</p>
                                                </li>
                                            ))}
                                            <li className="flex items-start gap-4 pt-2">
                                                <div className="w-6 h-6 bg-white border border-blue-200 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-black text-blue-500 shadow-sm"><DropletIcon className="w-3 h-3" /></div>
                                                <p className="text-slate-700 font-medium leading-snug">Improve drainage to prevent waterlogging.</p>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Weather Impact Section */}
                                    <div className="bg-blue-50/50 rounded-[2rem] p-8 border border-blue-100 shadow-sm flex flex-col">
                                        <div className="flex items-center gap-3 mb-6">
                                            <CloudRain className="w-6 h-6 text-blue-500" />
                                            <h4 className="font-bold text-slate-900 text-lg">Weather Impact</h4>
                                        </div>
                                        <p className="text-slate-600 text-sm font-medium mb-6">Optimal growing conditions expected. Rain forecast aligns well with early vegetation phase.</p>

                                        <div className="h-40 mt-auto">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={weatherChartData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                    <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                                    <RechartsTooltip cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                                                    <Bar dataKey="rain" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center relative z-10 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                <p className="text-slate-500 mb-6 font-medium">No active recommendations. Run an analysis to get started.</p>
                                <button
                                    onClick={() => setActiveTab('recommend')}
                                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-xl shadow-slate-900/20"
                                >
                                    Analyze Soil Now
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:hidden">
                        {/* Multi-Crop Comparison Table */}
                        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-xl shadow-slate-200/40">
                            <h3 className="text-lg font-black text-slate-800 tracking-tight mb-2 flex items-center justify-between">
                                Multi-Crop Comparison
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Explore Alternatives</p>

                            <div className="space-y-4">
                                {recommendation?.alternatives?.map((alt, i) => (
                                    <div onClick={() => alert(`Feature coming soon: Switch plan to ${alt.name}`)} key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${i === 0 ? 'bg-indigo-50/50 border-indigo-100 ring-4 ring-indigo-500/10' : 'bg-slate-50 hover:bg-white border-slate-100 shadow-sm'} transition-all cursor-pointer`}>
                                        <div>
                                            <h4 className="text-slate-900 font-black flex items-center gap-2">
                                                {alt.name} {i === 0 && <span className="bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">Top Pick</span>}
                                            </h4>
                                            <p className={`text-[10px] uppercase font-bold tracking-widest mt-1.5 ${alt.risk === 'Low' ? 'text-green-600' : alt.risk === 'Medium' ? 'text-orange-500' : 'text-red-500'}`}>
                                                {alt.risk} Risk
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`font-black text-xs px-2.5 py-1 rounded-lg ${alt.match > 80 ? 'bg-green-100 text-green-700' : alt.match > 70 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {alt.match}% Match
                                            </span>
                                            <p className="text-slate-900 font-black text-sm mt-1.5">{alt.profit}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Government Scheme Suggestions */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden text-white">
                            <div className="absolute -right-10 -bottom-10 opacity-10">
                                <Landmark size={180} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-lg font-black tracking-tight mb-2 flex items-center gap-3">
                                    <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm"><Landmark size={18} /></div>
                                    Govt. Schemes Eligibility
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Based on State: {recommendation?.state || "Andhra Pradesh"}</p>

                                <div className="space-y-4">
                                    {schemes.map((s, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors p-4 rounded-2xl backdrop-blur-md">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-white text-sm">{s.name}</h4>
                                                <span className="text-[9px] uppercase tracking-widest font-black px-2 py-1 bg-white/10 rounded-lg">{s.tag}</span>
                                            </div>
                                            <p className="text-slate-300 text-xs font-medium">{s.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => window.open('https://www.myscheme.gov.in/', '_blank')} className="mt-6 w-full py-4 text-xs font-black uppercase tracking-widest bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-colors shadow-lg">
                                    Check Application Portal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column KPIs */}
                <div className="space-y-8 flex flex-col">

                    {/* Profit Estimation Module */}
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
                        <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3 relative z-10">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                                <PieChart className="w-5 h-5" />
                            </div>
                            Profit Estimation Card
                        </h3>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-slate-500 text-sm font-bold">Estimated Yield</span>
                                <span className="text-slate-900 font-black text-lg">12 <span className="text-slate-400 text-sm font-bold">Tons/ac</span></span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-slate-500 text-sm font-bold">Investment Required</span>
                                <span className="text-red-500 font-black text-lg">₹40,000</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-slate-500 text-sm font-bold">Expected Revenue</span>
                                <span className="text-slate-900 font-black text-lg">₹95,000</span>
                            </div>
                            <div className="pt-6 border-t border-slate-100 mt-6 bg-gradient-to-r from-emerald-500 to-green-500 p-6 rounded-2xl text-white shadow-lg shadow-green-500/20">
                                <div className="flex justify-between items-end">
                                    <span className="text-green-50 font-bold uppercase tracking-widest text-[10px]">Net Profit Focus</span>
                                    <span className="text-4xl font-black">₹55,000</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline UI */}
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 print:break-inside-avoid">
                        <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                                <Calendar className="w-5 h-5" />
                            </div>
                            Crop Growth Timeline
                        </h3>
                        <div className="relative pl-6 border-l-2 border-indigo-100 space-y-8">
                            <div className="relative">
                                <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-white shadow-sm mt-1"></div>
                                <span className="text-indigo-600 text-[10px] uppercase font-black tracking-widest bg-indigo-50 px-2 py-1 rounded-md">Week 1</span>
                                <h4 className="text-slate-900 font-bold text-md mt-2">Sowing & Soil Prep</h4>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed mt-1">Apply basal dose of fertilizers. Sow seeds at 2-3 cm depth.</p>
                            </div>
                            <div className="relative opacity-80">
                                <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-slate-300 ring-4 ring-white mt-1"></div>
                                <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest bg-slate-100 px-2 py-1 rounded-md">Week 4</span>
                                <h4 className="text-slate-900 font-bold text-md mt-2">1st Top Dressing (Fertilizer)</h4>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed mt-1">Add nitrogen boosters (Urea) and initiate weeding process.</p>
                            </div>
                            <div className="relative opacity-60">
                                <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-slate-300 ring-4 ring-white mt-1"></div>
                                <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest bg-slate-100 px-2 py-1 rounded-md">Weekly</span>
                                <h4 className="text-slate-900 font-bold text-md mt-2">Irrigation Cycle</h4>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed mt-1">Maintain consistent moisture. Avoid waterlogging in the root zone.</p>
                            </div>
                            <div className="relative opacity-60">
                                <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-slate-300 ring-4 ring-white mt-1"></div>
                                <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest bg-slate-100 px-2 py-1 rounded-md">Month 6</span>
                                <h4 className="text-slate-900 font-bold text-md mt-2">Harvesting</h4>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed mt-1">Monitor crop maturity indicators. Prepare for post-harvest storage.</p>
                            </div>
                        </div>

                        <button
                            onClick={() => handleAction(setReminderText, 'Set Reminder', 'Added to Calendar!')}
                            className="w-full mt-8 bg-slate-50 hover:bg-slate-100 text-slate-800 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-200 print:hidden"
                        >
                            <Bell size={16} /> {reminderText}
                        </button>
                    </div>

                    {/* Satellite MAP Feature (Investor Level) */}
                    <div onClick={() => window.open('https://earthengine.google.com/', '_blank')} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex-1 flex flex-col items-center justify-center text-center group cursor-pointer min-h-[300px] print:hidden">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-6f2a6a0a3824?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-transform duration-1000 blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

                        {/* Map Overlay Elements */}
                        <div className="absolute top-6 left-6 flex gap-2 z-10">
                            <span className="bg-emerald-500 text-white font-black uppercase tracking-widest text-[8px] px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg shadow-emerald-500/20">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> Live NDVI
                            </span>
                        </div>

                        <div className="relative z-10 w-full mt-auto mb-4">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-left">
                                <h3 className="text-xl font-black text-white tracking-tight mb-4 flex items-center gap-3">
                                    <Map className="w-5 h-5 text-emerald-400" /> Satellite Vegetation Index
                                </h3>
                                <div className="flex justify-between items-center text-white mb-2">
                                    <span className="text-xs font-bold text-slate-300">Field Health Score</span>
                                    <span className="text-sm font-black text-emerald-400">0.78 (Good)</span>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                                    <div className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500 w-[78%]"></div>
                                </div>
                                <p className="text-slate-400 text-[11px] font-medium leading-relaxed">
                                    Green coverage indicates excellent chlorophyll density. No anomalies detected in designated region.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

function DropletIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>
    )
}

export default Dashboard
