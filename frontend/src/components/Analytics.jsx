import { Activity, TrendingUp, Droplets, FlaskConical, Calendar } from 'lucide-react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const Analytics = ({ history }) => {
    const recs = [...(history?.recommendations || [])].reverse()

    const nutrientData = {
        labels: recs.map(r => new Date(r.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })),
        datasets: [
            {
                label: 'Nitrogen (N)',
                data: recs.map(r => r.inputs?.N),
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Phosphorus (P)',
                data: recs.map(r => r.inputs?.P),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Potassium (K)',
                data: recs.map(r => r.inputs?.K),
                borderColor: '#eab308',
                backgroundColor: 'rgba(234, 179, 8, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ]
    }

    const yieldData = {
        labels: recs.map(r => r.crop),
        datasets: [
            {
                label: 'Match Confidence (%)',
                data: recs.map(r => Math.round(r.confidence * 100)),
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
                borderRadius: 8,
            }
        ]
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#a8a29e', font: { weight: 'bold' } }
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(120, 113, 108, 0.1)' },
                ticks: { color: '#78716c' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#78716c' }
            }
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Farm Analytics</h1>
                <p className="text-stone-400">Visualizing soil health and crop optimization trends.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Nutrient Trends */}
                <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-farm-green-500/10 rounded-lg text-farm-green-400">
                            <FlaskConical className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Soil Nutrient Trends</h2>
                    </div>
                    <div className="h-64">
                        <Line data={nutrientData} options={options} />
                    </div>
                </div>

                {/* Yield Potential */}
                <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Match Accuracy Comparison</h2>
                    </div>
                    <div className="h-64">
                        <Bar data={yieldData} options={options} />
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-farm-green-500/20 rounded-xl flex items-center justify-center text-farm-green-400">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">Total Scans</p>
                            <p className="text-2xl font-black text-white">{history?.recommendations?.length || 0}</p>
                        </div>
                    </div>
                    <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                            <Droplets className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">Avg Phosphorous</p>
                            <p className="text-2xl font-black text-white">
                                {recs.length > 0 ? Math.round(recs.reduce((acc, r) => acc + (r.inputs?.P || 0), 0) / recs.length) : 0} mg/kg
                            </p>
                        </div>
                    </div>
                    <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">Data Retention</p>
                            <p className="text-2xl font-black text-white">Last 10 Cycles</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analytics
