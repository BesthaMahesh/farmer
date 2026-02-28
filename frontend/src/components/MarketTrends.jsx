import { useState, useEffect } from 'react'
import { LineChart, TrendingUp, TrendingDown, ArrowRight, BarChart3, Info, RefreshCw, Loader2 } from 'lucide-react'
import axios from 'axios'

const MarketTrends = () => {
    const [trends, setTrends] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchTrends = async () => {
        setLoading(true)
        try {
            const response = await axios.get('http://localhost:5000/api/market-trends')
            setTrends(response.data)
        } catch (error) {
            console.error("Error fetching market trends:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTrends()
    }, [])

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Market Intelligence</h1>
                    <p className="text-stone-400">Real-time agricultural commodity prices and trend analysis.</p>
                </div>
                <button
                    onClick={fetchTrends}
                    disabled={loading}
                    className="p-3 bg-stone-900 border border-stone-800 rounded-2xl text-stone-400 hover:text-farm-green-400 transition-all hover:border-farm-green-500/30 disabled:opacity-50"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </header>

            {loading ? (
                <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-12 h-12 text-farm-green-500 animate-spin" />
                    <p className="text-stone-500 font-medium italic">Scanning national markets...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trends.map((item, i) => (
                        <div
                            key={i}
                            className="bg-stone-900 border border-stone-800 rounded-3xl p-6 hover:border-stone-700 transition-all group relative overflow-hidden"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl ${item.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                    }`}>
                                    {item.trend === 'up' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Volatility</p>
                                    <span className={`text-sm font-bold ${item.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                                        }`}>
                                        {item.trend === 'up' ? '+' : '-'}{item.change}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1 mb-6">
                                <h3 className="text-2xl font-bold text-white tracking-tight">{item.crop}</h3>
                                <p className="text-stone-400 font-medium">{item.price}</p>
                            </div>

                            <div className="pt-6 border-t border-stone-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BarChart3 size={16} className="text-stone-500" />
                                    <span className="text-sm text-stone-500">Demand: </span>
                                    <span className="text-sm font-bold text-stone-300">{item.demand}</span>
                                </div>
                                <button className="text-farm-green-400 hover:text-farm-green-300 transition-colors">
                                    <ArrowRight size={20} />
                                </button>
                            </div>

                            {/* Glow Effect */}
                            <div className={`absolute -bottom-12 -right-12 w-24 h-24 blur-[60px] opacity-20 pointer-events-none ${item.trend === 'up' ? 'bg-emerald-500' : 'bg-red-500'
                                }`} />
                        </div>
                    ))}
                </div>
            )}

            {/* Market Insight Banner */}
            <div className="bg-gradient-to-r from-farm-green-600/20 to-emerald-600/10 border border-farm-green-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 bg-farm-green-500/20 rounded-2xl text-farm-green-400">
                    <Info size={32} />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-white mb-1">Market Insight</h3>
                    <p className="text-stone-400 leading-relaxed">
                        Commodity prices are currently showing a <span className="text-emerald-400 font-bold uppercase">Positive Bullish</span> trend across South India due to favorable monsoon forecasts and stable supply chains.
                    </p>
                </div>
                <button className="bg-farm-green-600 hover:bg-farm-green-500 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-farm-green-900/40 shrink-0">
                    Full Report
                </button>
            </div>
        </div>
    )
}

export default MarketTrends
