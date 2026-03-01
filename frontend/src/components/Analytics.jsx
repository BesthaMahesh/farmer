import { useState, useEffect } from 'react'
import {
    Activity, TrendingUp, Droplets, Calendar, Download, Filter,
    AlertTriangle, CloudRain, Sun, Sprout, Network, Zap,
    FileText, DownloadCloud, Mail, ChevronDown, CheckCircle, Target,
    ArrowUpRight, ArrowDownRight, Info, ArrowRight
} from 'lucide-react'
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, ZAxis,
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, ComposedChart
} from 'recharts'

// Mock Data Models
const yieldPredictionData = [
    { month: 'Jan', actual: 2.1, predicted: 2.2 },
    { month: 'Feb', actual: 2.4, predicted: 2.5 },
    { month: 'Mar', actual: 2.8, predicted: 2.7 },
    { month: 'Apr', actual: 3.1, predicted: 3.2 },
    { month: 'May', predicted: 3.5 },
    { month: 'Jun', predicted: 3.8 },
];

const weatherYieldData = [
    { month: 'Jan', rainfall: 40, temp: 22, yield: 2.1 },
    { month: 'Feb', rainfall: 35, temp: 24, yield: 2.4 },
    { month: 'Mar', rainfall: 50, temp: 27, yield: 2.8 },
    { month: 'Apr', rainfall: 60, temp: 30, yield: 3.1 },
    { month: 'May', rainfall: 80, temp: 32, yield: 3.5 },
];

const profitTrendData = [
    { month: 'Jan', revenue: 45000, investment: 20000 },
    { month: 'Feb', revenue: 52000, investment: 15000 },
    { month: 'Mar', revenue: 68000, investment: 18000 },
    { month: 'Apr', revenue: 75000, investment: 12000 },
    { month: 'May', revenue: 90000, investment: 15000 },
];

const seasonalData = [
    { name: 'Kharif 2025', yield: 4.2, profit: 85000, soil: 78 },
    { name: 'Rabi 2026', yield: 5.1, profit: 110000, soil: 84 },
];

const scatterData = [
    { match: 65, npk: 120 }, { match: 70, npk: 135 }, { match: 75, npk: 150 },
    { match: 82, npk: 160 }, { match: 88, npk: 180 }, { match: 92, npk: 195 },
    { match: 95, npk: 210 }, { match: 80, npk: 155 }, { match: 85, npk: 170 },
];

const fieldsData = [
    { name: 'Field A (North)', score: 82, yield: '3.2T', profit: '₹55k', status: 'Optimal' },
    { name: 'Field B (East)', score: 68, yield: '2.1T', profit: '₹32k', status: 'Warning' },
    { name: 'Field C (South)', score: 91, yield: '4.5T', profit: '₹88k', status: 'Excellent' },
];

const Analytics = ({ history }) => {
    const [dateRange, setDateRange] = useState('30 Days');
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Dynamic calculations based on history (with fallbacks to mock data)
    const recs = [...(history?.recommendations || [])].reverse()
    const latestRec = recs.length > 0 ? recs[recs.length - 1] : null;

    // Soil Health Score Formula
    const calculateSoilHealth = (inputs) => {
        if (!inputs) return 76; // Default
        const nScore = Math.min(100, Math.max(0, 100 - Math.abs(60 - inputs.N))); // Ideal ~60
        const pScore = Math.min(100, Math.max(0, 100 - Math.abs(45 - inputs.P))); // Ideal ~45
        const kScore = Math.min(100, Math.max(0, 100 - Math.abs(180 - inputs.K) * 0.5)); // Ideal ~180
        const phScore = Math.min(100, Math.max(0, 100 - Math.abs(6.5 - inputs.ph) * 20)); // Ideal ~6.5

        return Math.round((nScore * 0.3) + (pScore * 0.2) + (kScore * 0.2) + (phScore * 0.3));
    }

    const soilHealthScore = calculateSoilHealth(latestRec?.inputs);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 bg-[#f1f5f9]">

            {/* Header section w/ Filters */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-slate-200">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Farm Analytics</h1>
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700 px-2.5 py-1 rounded-lg border border-green-200">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Live
                        </span>
                    </div>
                    <p className="text-slate-500 font-medium">Visualizing soil health, yield predictions, and multi-field telemetry.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Date Range Filter */}
                    <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                        {['7 Days', '30 Days', '3 Months', 'Custom'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${dateRange === range ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                            >
                                {range === '7 Days' ? 'Last ' : ''}{range}
                            </button>
                        ))}
                    </div>

                    {/* Download/Export Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                        >
                            <DownloadCloud size={16} /> Export Report <ChevronDown size={14} />
                        </button>

                        {showExportMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <button onClick={() => { window.print(); setShowExportMenu(false) }} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100">
                                    <FileText size={16} className="text-blue-500" /> Download PDF
                                </button>
                                <button onClick={() => setShowExportMenu(false)} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100">
                                    <Download size={16} className="text-green-500" /> Export CSV
                                </button>
                                <button onClick={() => setShowExportMenu(false)} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                    <Mail size={16} className="text-indigo-500" /> Email Report
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* TOP KPI ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* 1. Soil Health Score (Composite Index) */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-colors">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500" /> Soil Health Index
                    </h3>
                    <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * soilHealthScore) / 100} className="text-emerald-500 transition-all duration-1000" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-slate-800">{soilHealthScore}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-700 mb-1">{soilHealthScore > 80 ? 'Excellent' : soilHealthScore > 60 ? 'Good' : 'Needs Work'}</p>
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                <ArrowUpRight size={14} /> +4% this month
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Benchmark Comparison */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm group hover:border-blue-200 transition-colors">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <Target size={14} className="text-blue-500" /> Benchmark (State Avg)
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1.5">
                                <span className="text-slate-600">Your Nitrogen</span>
                                <span className="text-blue-600">{latestRec?.inputs?.N || 50} mg/kg</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(latestRec?.inputs?.N || 50) / 140 * 100}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1.5">
                                <span className="text-slate-600">State Avg. (AP)</span>
                                <span className="text-slate-400">42 mg/kg</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-300 rounded-full" style={{ width: `${42 / 140 * 100}%` }}></div>
                            </div>
                        </div>
                        <p className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Status: 19% Above Average</p>
                    </div>
                </div>

                {/* 3. AI Model Performance */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                        <Network size={14} className="text-indigo-400" /> Core Engine Telemetry
                    </h3>
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Accuracy</p>
                            <p className="text-2xl font-black text-white">91.4%</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Precision</p>
                            <p className="text-2xl font-black text-indigo-400">89.0%</p>
                        </div>
                        <div className="col-span-2 pt-3 border-t border-slate-800 flex justify-between">
                            <div>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Dataset</p>
                                <p className="text-xs font-medium text-slate-300 mt-0.5">50,000+ samples</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Last Update</p>
                                <p className="text-xs font-medium text-slate-300 mt-0.5">25 Feb 2026</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Anomaly Detection (Advanced) */}
                <div className="bg-red-50/50 border border-red-100 rounded-[2rem] p-6 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500"><AlertTriangle size={80} /></div>
                    <h3 className="text-xs font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Zap size={14} /> Neural Anomaly Radar
                    </h3>
                    <div className="bg-white/60 p-3 rounded-xl border border-red-100 mb-3 backdrop-blur-sm">
                        <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            Abnormal Potassium Spike
                        </p>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">AI Confidence</p>
                            <p className="text-lg font-black text-slate-800">78%</p>
                        </div>
                        <button className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                            Investigate <ArrowRight size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* MAIN CHART ROW 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Yield Prediction Graph */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><TrendingUp className="text-indigo-500" /> Yield Prediction Engine</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Actual vs AI Predicted (Tons/Ac)</p>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={yieldPredictionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                                <Area type="monotone" dataKey="predicted" name="AI Prediction" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPredicted)" />
                                <Line type="monotone" dataKey="actual" name="Actual Yield" stroke="#10b981" strokeWidth={4} dot={{ r: 5, strokeWidth: 2 }} activeDot={{ r: 7 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Weather Impact Analytics */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><CloudRain className="text-blue-500" /> Weather vs Yield Impact</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Rainfall (mm) & Temp (°C) Correlation</p>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={weatherYieldData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" stroke="#3b82f6" tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                                <Bar yAxisId="left" dataKey="rainfall" name="Rainfall (mm)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} opacity={0.8} />
                                <Line yAxisId="right" type="monotone" dataKey="yield" name="Yield (T/Ac)" stroke="#10b981" strokeWidth={4} dot={{ r: 4 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex gap-4">
                        <div className="bg-orange-50 px-4 py-2 rounded-xl flex items-center gap-3">
                            <Sun className="text-orange-500 w-5 h-5" />
                            <div>
                                <p className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">Heat Stress Days</p>
                                <p className="text-sm font-black text-orange-900">4 Days Recorded</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CHART ROW 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Profit Trend Over Time (Col span 2) */}
                <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl text-white">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-black flex items-center gap-2">💰 Profit Analytics & ROI</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Revenue vs Investment (Break-even Analysis)</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={profitTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '1rem', border: '1px solid #334155', backgroundColor: '#0f172a', fontWeight: 'bold', color: '#fff' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                                <Area type="monotone" dataKey="revenue" name="Expected Revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                <Area type="monotone" dataKey="investment" name="Capital Invested" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorInv)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Correlation Analysis Chart (Scatter) */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                    <h3 className="text-md font-black text-slate-900 mb-1 flex items-center gap-2">📌 NPK Correlation</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Total NPK vs AI Match %</p>
                    <div className="h-48 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 10, right: 10, left: -25, bottom: -10 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" dataKey="npk" name="NPK Sum" domain={['dataMin - 10', 'dataMax + 10']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                <YAxis type="number" dataKey="match" name="Match %" domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                <ZAxis range={[60, 100]} />
                                <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                                <Scatter name="Correlation" data={scatterData} fill="#6366f1" opacity={0.7} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-xl">
                        <p className="text-[10px] text-indigo-800 font-bold uppercase tracking-widest text-center">Correlation Coefficient: <span className="text-indigo-600 font-black text-sm ml-1">+0.84</span></p>
                        <p className="text-[9px] text-indigo-600/70 text-center font-bold mt-1">Strong Positive Correlation</p>
                    </div>
                </div>
            </div>

            {/* ROW 3: Alerts, Multi-Field & Seasonal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Nutrient Deficiency Alerts & Details */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Multi-Field Comparison */}
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">🌍 Multi-Field Comparison (Enterprise)</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-3 text-xs font-black text-slate-400 uppercase tracking-widest">Field Sector</th>
                                        <th className="pb-3 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Soil Score</th>
                                        <th className="pb-3 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Proj. Yield</th>
                                        <th className="pb-3 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Est. Profit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fieldsData.map((field, idx) => (
                                        <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                                            <td className="py-4 text-sm font-bold text-slate-800 flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${field.status === 'Optimal' ? 'bg-blue-500' : field.status === 'Excellent' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                                                {field.name}
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className={`px-3 py-1 text-xs font-black rounded-lg ${field.score > 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {field.score}
                                                </span>
                                            </td>
                                            <td className="py-4 text-sm font-bold text-slate-700 text-center">{field.yield}</td>
                                            <td className="py-4 text-sm font-black text-slate-900 text-right group-hover:text-emerald-600 transition-colors">{field.profit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Nutrient Deficiency Alert */}
                    <div className="bg-orange-50 border border-orange-200 rounded-[2rem] p-6 shadow-sm flex items-start gap-5">
                        <div className="p-3 bg-orange-200 rounded-2xl text-orange-600 shrink-0">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h4 className="text-orange-900 font-bold text-lg mb-1 flex items-center gap-2">
                                Nitrogen Deficiency Detected
                                <span className="bg-red-100 text-red-600 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md font-black">Urgent</span>
                            </h4>
                            <p className="text-orange-800 text-sm font-medium mb-3">Field B (East) is showing critical drops in nitrogen levels affecting leaf growth in the vegetative stage.</p>
                            <div className="bg-white/60 p-3 rounded-xl border border-orange-200 inline-flex items-center gap-2 backdrop-blur-sm">
                                <span className="text-xl">📌</span>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-orange-600 tracking-widest">Suggested Action</p>
                                    <p className="text-sm font-black text-slate-800">Add 15kg Urea per acre immediately.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seasonal Comparison */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col">
                    <h3 className="text-md font-black text-slate-900 mb-1 flex items-center gap-2">📅 Seasonal Comparison</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Historical Cycle Tracking</p>

                    <div className="space-y-6 mt-2 flex-1">
                        {seasonalData.map((season, idx) => (
                            <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <h4 className="font-black text-slate-800 mb-4">{season.name}</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Avg Yield</span>
                                        <span className="font-black text-slate-900">{season.yield} T/Ac</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${season.yield * 15}%` }}></div>
                                    </div>

                                    <div className="flex justify-between items-center text-sm pt-2">
                                        <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Net Profit</span>
                                        <span className="font-black text-emerald-600">₹{(season.profit / 1000).toFixed(1)}k</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${season.profit / 1500}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs font-medium text-slate-500">
                            Overall profitability improved by <span className="font-black text-emerald-600">29.4%</span> across seasons.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Analytics
