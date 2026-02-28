import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Advisory from './components/Advisory'
import RecommendationForm from './components/RecommendationForm'
import MarketTrends from './components/MarketTrends'
import Analytics from './components/Analytics'

function App() {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [recommendation, setRecommendation] = useState(() => {
        const saved = localStorage.getItem('recommendation')
        return saved ? JSON.parse(saved) : null
    })
    const [lastDetection, setLastDetection] = useState(() => {
        const saved = localStorage.getItem('lastDetection')
        return saved ? JSON.parse(saved) : null
    })
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('farmHistory')
        return saved ? JSON.parse(saved) : { recommendations: [], detections: [] }
    })

    useEffect(() => {
        localStorage.setItem('recommendation', JSON.stringify(recommendation))
        if (recommendation && !history.recommendations.find(r => r.timestamp === recommendation.timestamp)) {
            setHistory(prev => ({
                ...prev,
                recommendations: [recommendation, ...prev.recommendations].slice(0, 10)
            }))
        }
    }, [recommendation])

    useEffect(() => {
        localStorage.setItem('lastDetection', JSON.stringify(lastDetection))
        if (lastDetection && !history.detections.find(d => d.timestamp === lastDetection.timestamp)) {
            setHistory(prev => ({
                ...prev,
                detections: [lastDetection, ...prev.detections].slice(0, 10)
            }))
        }
    }, [lastDetection])

    useEffect(() => {
        localStorage.setItem('farmHistory', JSON.stringify(history))
    }, [history])

    return (
        <div className="flex h-screen bg-stone-950 text-stone-200 overflow-hidden font-sans">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                <div className="max-w-7xl mx-auto">
                    {activeTab === 'dashboard' && (
                        <Dashboard
                            recommendation={recommendation}
                            lastDetection={lastDetection}
                            history={history}
                            setActiveTab={setActiveTab}
                        />
                    )}
                    {activeTab === 'analytics' && (
                        <Analytics history={history} />
                    )}
                    {activeTab === 'recommend' && (
                        <RecommendationForm setRecommendation={setRecommendation} setActiveTab={setActiveTab} />
                    )}
                    {activeTab === 'advisory' && (
                        <Advisory setLastDetection={setLastDetection} />
                    )}
                    {activeTab === 'market' && <MarketTrends />}
                </div>
            </main>
        </div>
    )
}

export default App
