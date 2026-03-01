import { useState, useEffect } from 'react'
import {
    TrendingUp, TrendingDown, MapPin, Search, Calendar,
    BarChart3, Globe, Activity, Star, AlertCircle, ArrowUpRight, ArrowDownRight,
    Newspaper, Droplets, Leaf
} from 'lucide-react'
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts'

// Fake data for the historical trend graph
const historyData = [
    { name: 'Aug', price: 23 },
    { name: 'Sep', price: 25 },
    { name: 'Oct', price: 24 },
    { name: 'Nov', price: 28 },
    { name: 'Dec', price: 30 },
    { name: 'Jan', price: 34 },
    { name: 'Feb', price: 28 },
];

const MarketTrends = ({ recommendation }) => {
    const formatCropName = (name) => {
        if (!name) return 'Papaya';
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    const defaultCrop = formatCropName(recommendation?.crop);
    const [selectedCrop, setSelectedCrop] = useState(defaultCrop);

    useEffect(() => {
        if (recommendation?.crop) {
            setSelectedCrop(formatCropName(recommendation.crop));
        }
    }, [recommendation]);

    // Format metrics dynamically based on selectedCrop
    const generateLiveMetrics = (currentCrop) => {
        const base = [
            { crop: 'Cotton', price: '₹6,400/q', trend7: '+2%', trend30: '-3%', isUp: true },
            { crop: 'Tomato', price: '₹18/kg', trend7: '-12%', trend30: '-20%', isUp: false },
            { crop: 'Turmeric', price: '₹14,200/q', trend7: '+8%', trend30: '+25%', isUp: true },
        ];

        let hasCurrent = false;
        const currentLower = currentCrop.toLowerCase();
        if (currentLower === 'papaya') {
            base.unshift({ crop: 'Papaya', price: '₹28/kg', trend7: '+4%', trend30: '+15%', isUp: true });
            hasCurrent = true;
        } else if (currentLower === 'cotton' || currentLower === 'tomato' || currentLower === 'turmeric') {
            hasCurrent = true;
        }

        if (!hasCurrent) {
            base.unshift({ crop: currentCrop, price: '₹34/kg', trend7: '+6%', trend30: '+12%', isUp: true });
        } else if (currentLower !== 'papaya') {
            base.push({ crop: 'Papaya', price: '₹28/kg', trend7: '+4%', trend30: '+15%', isUp: true });
        }

        return base;
    }

    const liveMetrics = generateLiveMetrics(selectedCrop);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            setSelectedCrop(formatCropName(e.target.value.trim()));
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">

            {/* Header section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 flex items-center gap-3">
                        Market Intelligence
                    </h1>
                    <p className="text-slate-500 flex items-center gap-2 font-medium">
                        Real-time pricing, AI forecasting, and agro-economic news.
                    </p>
                </div>
                <div className="relative group w-full md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input onKeyDown={handleSearch} type="text" placeholder="Search crops..." className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all" />
                </div>
            </header>

            {/* Smart Summary / Profit Opportunity Score */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex-1 w-full text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1.5 font-bold uppercase tracking-widest text-[10px] rounded-lg mb-4">
                        <Star className="w-3 h-3 fill-indigo-400" /> Top Opportunity
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tight mb-4">{selectedCrop}</h2>
                    <p className="text-slate-400 text-sm font-medium max-w-md leading-relaxed">
                        Based on your soil match (82%), extremely high market demand, and forecasted upcoming regional shortages, this is your optimal growth index.
                    </p>
                </div>

                <div className="relative z-10 shrink-0 bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-[2rem] text-center w-full md:w-64">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Profit Opportunity Score</p>
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 tracking-tighter">88<span className="text-2xl text-slate-500">/100</span></div>
                    <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 rounded-lg py-1.5">
                        <TrendingUp className="w-4 h-4" /> High Potential
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-8 flex flex-col">

                    {/* Live Crop Price Dashboard */}
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <Activity className="w-5 h-5 text-indigo-500" /> Live Market Dashboard
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <th className="pb-4 pl-4">Commodity</th>
                                        <th className="pb-4">Current Price</th>
                                        <th className="pb-4 text-center">7-Day Trend</th>
                                        <th className="pb-4 text-center">30-Day Trend</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {liveMetrics.map((item, i) => (
                                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                                            <td className="py-4 pl-4 font-black text-slate-800 text-sm">{item.crop}</td>
                                            <td className="py-4 font-bold text-slate-600">{item.price}</td>
                                            <td className="py-4 text-center">
                                                <span className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1rounded-lg ${item.trend7.includes('+') ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                                                    {item.trend7.includes('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                    {item.trend7}
                                                </span>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1rounded-lg ${item.trend30.includes('+') ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                                                    {item.trend30.includes('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                    {item.trend30}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Historical Trend Graph */}
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <BarChart3 className="w-5 h-5 text-indigo-500" /> Historical Price Trends
                            </h3>
                            <select
                                value={selectedCrop}
                                onChange={(e) => setSelectedCrop(e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-2 outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
                            >
                                <option value="Papaya">Papaya</option>
                                <option value="Cotton">Cotton</option>
                                <option value="Tomato">Tomato</option>
                                {selectedCrop !== 'Papaya' && selectedCrop !== 'Cotton' && selectedCrop !== 'Tomato' && (
                                    <option value={selectedCrop}>{selectedCrop}</option>
                                )}
                            </select>
                        </div>

                        <div className="h-64 text-sm font-bold">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={historyData}>
                                    <defs>
                                        <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '1rem', color: '#0f172a', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                    <Area type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorHistory)" activeDot={{ r: 8, strokeWidth: 2 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column Grid */}
                <div className="space-y-8 flex flex-col">

                    {/* Price Forecast (AI Prediction) */}
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
                        <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 relative z-10">
                            <TrendingUp className="w-4 h-4" /> AI Price Forecast
                        </h3>

                        <div className="relative z-10 mb-6 pb-6 border-b border-slate-800">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Predicted {selectedCrop} Next Week</p>
                            <div className="flex items-end gap-3 mt-2">
                                <h4 className="text-4xl font-black text-white">₹32<span className="text-xl text-slate-500 font-bold">/kg</span></h4>
                                <span className="text-emerald-400 text-sm font-black mb-1.5 flex items-center gap-1">+14% <ArrowUpRight className="w-3 h-3" /></span>
                            </div>
                        </div>

                        <div className="relative z-10 flex justify-between items-center">
                            <span className="text-slate-400 text-sm font-bold">Model Confidence</span>
                            <span className="text-white font-black bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">84%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-3 shadow-inner relative z-10">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400" style={{ width: '84%' }}></div>
                        </div>
                    </div>

                    {/* Demand & Supply Indicator */}
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-indigo-500" /> Regional Dynamics
                        </h3>
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-bold text-slate-900 text-sm">Market Demand</span>
                                <span className="text-emerald-600 bg-emerald-50 font-black text-[10px] uppercase px-2 py-1 rounded-md tracking-wider">High</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-bold text-slate-900 text-sm">Current Supply</span>
                                <span className="text-orange-600 bg-orange-50 font-black text-[10px] uppercase px-2 py-1 rounded-md tracking-wider">Low</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-orange-400 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Regional Price Comparison */}
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-indigo-500" /> AP Hubs
                            </h3>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors group">
                                <span className="font-bold text-slate-700 text-sm group-hover:text-slate-900 transition-colors">Nandyal APMC</span>
                                <span className="font-black text-indigo-600">₹30/kg</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors group">
                                <span className="font-bold text-slate-700 text-sm group-hover:text-slate-900 transition-colors">Kurnool</span>
                                <span className="font-black text-slate-900">₹28/kg</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors group">
                                <span className="font-bold text-slate-700 text-sm group-hover:text-slate-900 transition-colors">Kadapa</span>
                                <span className="font-black text-emerald-600">₹32/kg</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors group">
                                <span className="font-bold text-slate-700 text-sm group-hover:text-slate-900 transition-colors">Hyderabad (TG)</span>
                                <span className="font-black text-emerald-600 flex items-center gap-2">
                                    ₹36/kg <span className="text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase tracking-widest">+Freight</span>
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Agriculture News Section */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Newspaper className="w-6 h-6" />
                        </div>
                        Agri-Economic News
                    </h2>
                    <button onClick={() => window.open('https://krishijagran.com/agripedia/', '_blank')} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">View All Coverage</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div onClick={() => window.open('https://pmkisan.gov.in/', '_blank')} className="group cursor-pointer">
                        <div className="h-40 bg-slate-100 rounded-2xl mb-4 overflow-hidden relative">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700"></div>
                            <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-lg">Govt Scheme</div>
                        </div>
                        <h4 className="font-black text-slate-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">PM-KISAN 15th Installment Date Released</h4>
                        <p className="text-sm text-slate-500 font-medium line-clamp-2">Direct benefit transfers will commence from the end of November for all registered farmers.</p>
                        <span className="text-xs text-slate-400 font-bold mt-3 block uppercase tracking-widest">2 hours ago</span>
                    </div>

                    <div onClick={() => window.open('https://agricoop.gov.in/', '_blank')} className="group cursor-pointer">
                        <div className="h-40 bg-slate-100 rounded-2xl mb-4 overflow-hidden relative">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700"></div>
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-lg">Market Policy</div>
                        </div>
                        <h4 className="font-black text-slate-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">Onion Export Duty Increased by 40%</h4>
                        <p className="text-sm text-slate-500 font-medium line-clamp-2">In a bid to control domestic prices, the finance ministry has ordered an immediate hike on export duties.</p>
                        <span className="text-xs text-slate-400 font-bold mt-3 block uppercase tracking-widest">5 hours ago</span>
                    </div>

                    <div onClick={() => window.open('https://mausam.imd.gov.in/', '_blank')} className="group cursor-pointer">
                        <div className="h-40 bg-slate-100 rounded-2xl mb-4 overflow-hidden relative">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586771107445-d3afeb0dece5?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700"></div>
                            <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-lg">Weather Alert</div>
                        </div>
                        <h4 className="font-black text-slate-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">El Niño Phase Weakens Prior to Rabi Sowing</h4>
                        <p className="text-sm text-slate-500 font-medium line-clamp-2">Meteorologists predict standard winter rainfall, easing massive drought concerns across central India.</p>
                        <span className="text-xs text-slate-400 font-bold mt-3 block uppercase tracking-widest">1 day ago</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MarketTrends
