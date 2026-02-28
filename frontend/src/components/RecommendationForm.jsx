import { useState } from 'react'
import { Beaker, Send, Loader2, ThermometerSun, Droplets, Wind } from 'lucide-react'
import axios from 'axios'

const RecommendationForm = ({ setRecommendation, setActiveTab }) => {
    const [formData, setFormData] = useState({
        N: '', P: '', K: '', ph: '', city: 'Nandyal'
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post('http://localhost:5000/api/recommend', formData)
            const newRec = {
                ...response.data,
                inputs: formData,
                timestamp: new Date().toISOString()
            }
            setRecommendation(newRec)
            setTimeout(() => {
                setActiveTab('dashboard')
                setLoading(false)
            }, 1500)
        } catch (error) {
            console.error("Error fetching recommendation:", error)
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto animate-in slide-in-from-right-8 duration-500">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-10 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-farm-green-500/20 rounded-2xl text-farm-green-400">
                        <Beaker size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white">Soil Analysis</h2>
                        <p className="text-stone-400">Enter your field data for a custom crop recommendation.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-500 uppercase tracking-widest ml-1">Nitrogen (N)</label>
                            <input
                                type="number"
                                placeholder="0-140"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-farm-green-500 transition-colors"
                                value={formData.N}
                                onChange={(e) => setFormData({ ...formData, N: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-500 uppercase tracking-widest ml-1">Phosphorus (P)</label>
                            <input
                                type="number"
                                placeholder="0-145"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-farm-green-500 transition-colors"
                                value={formData.P}
                                onChange={(e) => setFormData({ ...formData, P: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-500 uppercase tracking-widest ml-1">Potassium (K)</label>
                            <input
                                type="number"
                                placeholder="0-205"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-farm-green-500 transition-colors"
                                value={formData.K}
                                onChange={(e) => setFormData({ ...formData, K: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-500 uppercase tracking-widest ml-1">Soil pH (0-14)</label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="6.5"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-farm-green-500 transition-colors"
                                value={formData.ph}
                                onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-500 uppercase tracking-widest ml-1">Location / City</label>
                            <input
                                type="text"
                                placeholder="e.g. Nandyal"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-farm-green-500 transition-colors"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-farm-green-600 to-emerald-600 hover:from-farm-green-500 hover:to-emerald-500 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" /> Analyzing Dynamics...
                            </>
                        ) : (
                            <>
                                Generate Recommendation <Send size={20} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default RecommendationForm
