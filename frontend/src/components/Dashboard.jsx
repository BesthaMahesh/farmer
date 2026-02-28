import { useState, useEffect } from 'react'
import axios from 'axios'
import { TrendingUp, CloudRain, Sun, Thermometer, MapPin, Activity, ShieldCheck, AlertCircle } from 'lucide-react'

const Dashboard = ({ recommendation, lastDetection, history, setActiveTab }) => {
    const [weather, setWeather] = useState({ temp: 28, rainfall: 20, condition: 'Sunny', icon: '01d' })

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/weather?city=Nandyal')
                setWeather(res.data)
            } catch (err) {
                console.error('Weather fetch failed', err)
            }
        }
        fetchWeather()
    }, [])

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                        Welcome back, Farmer
                    </h1>
                    <p className="text-stone-400 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-farm-green-500" />
                        Nandyal, Andhra Pradesh • Today, {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-stone-900 border border-stone-800 px-6 py-3 rounded-2xl flex items-center gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            {weather.icon?.includes('d') ? <Sun className="w-5 h-5" /> : <CloudRain className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="text-xs text-stone-500 uppercase font-bold tracking-wider text-stone-400">Rainfall</p>
                            <p className="text-lg font-bold text-white">{weather.rainfall}mm</p>
                        </div>
                    </div>
                    <div className="bg-stone-900 border border-stone-800 px-6 py-3 rounded-2xl flex items-center gap-4">
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                            <Thermometer className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-stone-500 uppercase font-bold tracking-wider text-stone-400">Temp</p>
                            <p className="text-lg font-bold text-white">{Math.round(weather.temp)}°C</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recommendation Summary */}
                <div className="lg:col-span-2 bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <TrendingUp size={200} className="text-farm-green-500" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-6">Latest Recommendation</h2>
                        {recommendation ? (
                            <div className="flex flex-col md:flex-row gap-12">
                                <div>
                                    <p className="text-stone-400 mb-2 uppercase text-xs font-bold tracking-[0.2em]">Recommended Crop</p>
                                    <p className="text-5xl font-black text-farm-green-400">{recommendation.crop}</p>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-2 w-32 bg-stone-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-farm-green-500"
                                                style={{ width: `${recommendation.confidence * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-stone-300">{Math.round(recommendation.confidence * 100)}% Match</span>
                                    </div>
                                    <p className="text-stone-400 max-w-sm">
                                        Based on current soil NPK levels and upcoming seasonal weather forecasts.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <p className="text-stone-500 text-lg mb-6">No active recommendations yet.</p>
                                <button
                                    onClick={() => setActiveTab('recommend')}
                                    className="bg-farm-green-600 hover:bg-farm-green-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/40"
                                >
                                    Analyze My Farm
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Card */}
                <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 flex flex-col">
                    <h2 className="text-2xl font-bold text-white mb-6">Field Metrics</h2>
                    <div className="space-y-6 flex-1 text-sm lg:text-base">
                        <div className="flex justify-between items-center p-4 bg-stone-800/30 rounded-2xl">
                            <span className="text-stone-400">Soil Nitrogen (N)</span>
                            <span className="text-white font-bold">{recommendation?.inputs?.N || 90} mg/kg</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-stone-800/30 rounded-2xl">
                            <span className="text-stone-400">Soil Phosphorus (P)</span>
                            <span className="text-white font-bold">{recommendation?.inputs?.P || 42} mg/kg</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-stone-800/30 rounded-2xl">
                            <span className="text-stone-400">Potassium (K)</span>
                            <span className="text-white font-bold">{recommendation?.inputs?.K || 43} mg/kg</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-stone-800/30 rounded-2xl">
                            <span className="text-stone-400">Soil pH</span>
                            <span className="text-white font-bold">{recommendation?.inputs?.ph || 6.5}</span>
                        </div>
                    </div>
                </div>

                {/* Health Status Card */}
                <div className="lg:col-span-3 bg-stone-900 border border-stone-800 rounded-3xl p-8 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white">Crop Health Monitor</h2>
                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${!lastDetection || lastDetection.disease === 'healthy'
                            ? 'bg-farm-green-500/10 text-farm-green-400 border border-farm-green-500/20'
                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                            {!lastDetection ? 'Status: Scan Required' : `Status: ${lastDetection.disease === 'healthy' ? 'Clear' : 'Action Needed'}`}
                        </div>
                    </div>

                    {lastDetection ? (
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="relative group shrink-0">
                                <img src={lastDetection.image} alt="leaf" className="w-48 h-48 object-cover rounded-2xl border border-stone-800 shadow-2xl" />
                                <div className="absolute inset-0 bg-farm-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <p className="text-stone-400 text-sm font-bold uppercase tracking-widest mb-1">Latest Diagnosis</p>
                                    <div className="flex items-center gap-3">
                                        <h3 className={`text-3xl font-black uppercase ${lastDetection.disease === 'healthy' ? 'text-farm-green-400' : 'text-orange-400'}`}>
                                            {lastDetection.disease}
                                        </h3>
                                        <span className="bg-stone-800 text-stone-300 text-xs px-3 py-1 rounded-lg font-bold">
                                            {lastDetection.date}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 bg-black/40 border border-stone-800 rounded-2xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-stone-500">Confidence Score</span>
                                        <span className="text-sm text-stone-300 font-bold">{(lastDetection.confidence * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ${lastDetection.disease === 'healthy' ? 'bg-farm-green-500' : 'bg-red-500'}`}
                                            style={{ width: `${lastDetection.confidence * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <p className="text-stone-400 text-sm leading-relaxed">
                                    {lastDetection.disease === 'healthy'
                                        ? "Great news! Your plant shows strong vitals. Maintain current irrigation and monitoring."
                                        : `Your plant shows signs of ${lastDetection.disease}. Please visit the Advisory tab for specific treatment recommendations.`}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-stone-800 rounded-2xl">
                            <div className="p-4 bg-stone-800/50 rounded-full text-stone-500">
                                <Activity size={32} />
                            </div>
                            <div>
                                <p className="text-white font-bold">No health checks recenty</p>
                                <p className="text-stone-500 text-sm">Upload a leaf photo in the Advisory section for instant AI diagnosis.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
