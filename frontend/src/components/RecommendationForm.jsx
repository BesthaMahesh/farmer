import { useState } from 'react'
import { Beaker, Send, Loader2, MapPin, Info, Zap, Settings, ShieldAlert, CheckCircle2 } from 'lucide-react'
import axios from 'axios'

const locationsData = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Kakinada", "Rajahmundry", "Kadapa", "Tirupati", "Anantapur", "Vizianagaram", "Eluru", "Ongole", "Nandyal", "Machilipatnam", "Adoni", "Tenali", "Proddatur", "Chittoor", "Hindupur"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Miryalaguda", "Siddipet", "Jagtial", "Mancherial", "Kothagudem", "Kamareddy", "Sangareddy", "Bodhan", "Palwancha", "Nirmal"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"]
}

const getStatus = (val, low, high, max) => {
    if (!val && val !== 0) return { label: 'Enter Value', color: 'bg-slate-200', text: 'text-slate-500', width: 0 };
    const v = Number(val);
    const width = Math.min(100, Math.max(0, (v / max) * 100));
    if (v < low) return { label: 'Low', color: 'bg-orange-500', text: 'text-orange-600', width };
    if (v > high) return { label: 'High', color: 'bg-red-500', text: 'text-red-600', width };
    return { label: 'Optimal', color: 'bg-green-500', text: 'text-green-600', width };
}

const RecommendationForm = ({ setRecommendation, setActiveTab }) => {
    const [selectedState, setSelectedState] = useState("Andhra Pradesh")
    const [formData, setFormData] = useState({
        N: 50, P: 45, K: 180, ph: 6.5, city: 'Nandyal'
    })
    const [loading, setLoading] = useState(false)
    const [advancedMode, setAdvancedMode] = useState(false)
    const [detectingLocation, setDetectingLocation] = useState(false)

    const handleStateChange = (e) => {
        const newState = e.target.value
        setSelectedState(newState)
        if (!locationsData[newState].includes(formData.city)) {
            setFormData({ ...formData, city: locationsData[newState][0] })
        }
    }

    const handleDetectLocation = () => {
        setDetectingLocation(true);
        // Simulate GPS fetch
        setTimeout(() => {
            setSelectedState("Maharashtra");
            setFormData(prev => ({ ...prev, city: "Pune" }));
            setDetectingLocation(false);
        }, 1500);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post('/api/recommend', formData)
            const newRec = {
                ...response.data,
                inputs: formData,
                timestamp: new Date().toISOString(),
                advancedMode,
                state: selectedState,
                // Simulate multi-crop comparison
                alternatives: [
                    { name: 'Papaya', match: 84, risk: 'Low', profit: '₹55k' },
                    { name: 'Banana', match: 76, risk: 'Medium', profit: '₹48k' },
                    { name: 'Cotton', match: 64, risk: 'High', profit: '₹30k' }
                ]
            }
            setRecommendation(newRec)
            setTimeout(() => {
                setActiveTab('dashboard')
                setLoading(false)
            }, 1000)
        } catch (error) {
            console.error("Error fetching recommendation:", error)
            setLoading(false)
        }
    }

    const InputField = ({ label, name, min, max, optimalLow, optimalHigh, step = 1, desc }) => {
        const status = getStatus(formData[name], optimalLow, optimalHigh, max);
        return (
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative group hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        {label}
                        <div className="relative cursor-help">
                            <Info size={14} className="text-slate-400 hover:text-blue-500" />
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 text-center shadow-xl">
                                {desc} (Ideal: {optimalLow}-{optimalHigh})
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                            </div>
                        </div>
                    </label>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-opacity-10 ${status.color.replace('bg-', 'bg-')} ${status.text} flex items-center gap-1`}>
                        {status.label === 'Optimal' && <CheckCircle2 size={12} />}
                        {status.label === 'Low' && <ShieldAlert size={12} />}
                        {status.label === 'High' && <ShieldAlert size={12} />}
                        {status.label}
                    </span>
                </div>

                <div className="flex gap-4 items-center">
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={formData[name]}
                        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <input
                        type="number"
                        min={min}
                        max={max}
                        step={step}
                        value={formData[name]}
                        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                        className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-center focus:outline-none focus:border-blue-500 transition-all font-mono"
                        required
                    />
                </div>

                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${status.color}`}
                        style={{ width: `${status.width}%` }}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-right-8 duration-500 pb-12">

            {/* Advanced AI Toggle */}
            <div className="flex justify-end mb-4">
                <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between min-w-[300px]">
                    <button
                        type="button"
                        onClick={() => setAdvancedMode(false)}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${!advancedMode ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Standard Mode
                    </button>
                    <button
                        type="button"
                        onClick={() => setAdvancedMode(true)}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${advancedMode ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Zap size={16} className={advancedMode ? "fill-white" : ""} /> Advanced AI Mode
                    </button>
                </div>
            </div>

            <div className={`bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden transition-all duration-500 ${advancedMode ? 'border-2 border-indigo-500/30' : 'border border-slate-200'}`}>

                {advancedMode && (
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                )}

                <div className="flex items-center gap-5 mb-10 relative z-10">
                    <div className={`p-4 rounded-2xl ${advancedMode ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-blue-50 text-blue-600'}`}>
                        {advancedMode ? <Zap size={36} className="fill-white" /> : <Beaker size={36} />}
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            {advancedMode ? 'Deep AI Analysis' : 'Soil Analysis'}
                        </h2>
                        <p className="text-slate-500 mt-1 font-medium">
                            {advancedMode ? 'Using historical weather, market trends & satellite data' : 'Enter your field data for a custom crop recommendation.'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

                    <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 backdrop-blur-sm">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Settings size={16} className="text-slate-500" /> Chemical Properties Real-time Indicator
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Nitrogen (N)" name="N" min="0" max="140" optimalLow="40" optimalHigh="80" desc="Essential for leaf growth" />
                            <InputField label="Phosphorus (P)" name="P" min="0" max="145" optimalLow="30" optimalHigh="60" desc="Crucial for root development" />
                            <InputField label="Potassium (K)" name="K" min="0" max="205" optimalLow="150" optimalHigh="200" desc="Aids overall plant health" />
                            <InputField label="Soil pH" name="ph" min="0" max="14" step="0.1" optimalLow="6.0" optimalHigh="7.5" desc="Affects nutrient availability" />
                        </div>
                    </div>

                    <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={16} className="text-slate-500" /> Geographical Data
                            </h3>
                            <button
                                type="button"
                                onClick={handleDetectLocation}
                                disabled={detectingLocation}
                                className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border border-blue-100 shadow-sm"
                            >
                                {detectingLocation ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                                Auto Detect GPS
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">State</label>
                                <select
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer appearance-none shadow-sm"
                                    value={selectedState}
                                    onChange={handleStateChange}
                                    required
                                >
                                    {Object.keys(locationsData).map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">City / Region</label>
                                <select
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer appearance-none shadow-sm"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    required
                                >
                                    {locationsData[selectedState].map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {advancedMode && (
                            <div className="mt-6 flex items-start gap-4 bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
                                <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600 shrink-0 mt-0.5">
                                    <Zap size={18} />
                                </div>
                                <p className="text-sm text-indigo-900 font-medium leading-relaxed">
                                    <strong className="text-indigo-950 font-black block mb-1">Advanced Mode Active:</strong>
                                    System will fetch historical soil composition maps, 7-day weather forecast, risk assessment, and market prices for <strong>{formData.city}</strong>.
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 ${advancedMode
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/30'
                                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20'
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" /> {advancedMode ? 'Processing Neural Network...' : 'Analyzing Soil Data...'}
                            </>
                        ) : (
                            <>
                                {advancedMode ? 'Generate Masterplan' : 'Generate Recommendation'} <Send size={20} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default RecommendationForm
