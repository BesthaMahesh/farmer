import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Advisory from './components/Advisory'
import RecommendationForm from './components/RecommendationForm'
import MarketTrends from './components/MarketTrends'
import Analytics from './components/Analytics'
import Settings from './components/Settings'
import Login from './components/Login'
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { Menu, X, Sprout } from 'lucide-react'

function App() {
    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(true)
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoadingAuth(false)
        })
        return () => unsubscribe()
    }, [])

    const handleLogout = async () => {
        await signOut(auth)
        setUser(null)
    }

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

    if (loadingAuth) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f1f5f9]">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-green-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!user) {
        return <Login onLogin={setUser} />
    }

    return (
        <div className="flex h-screen bg-[#f1f5f9] text-slate-900 overflow-hidden font-sans relative">
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 z-30 absolute top-0 left-0 right-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Sprout className="text-white w-4 h-4" />
                    </div>
                    <span className="text-lg font-black text-slate-800 tracking-tight">AgroMind</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={handleLogout}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <main className="flex-1 overflow-y-auto p-4 pt-20 lg:pt-8 lg:p-12 custom-scrollbar">
                <div className="max-w-7xl mx-auto">
                    {activeTab === 'dashboard' && (
                        <Dashboard
                            user={user}
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
                    {activeTab === 'market' && <MarketTrends recommendation={recommendation} />}
                    {activeTab === 'settings' && <Settings user={user} />}
                </div>
            </main>
        </div>
    )
}

export default App
