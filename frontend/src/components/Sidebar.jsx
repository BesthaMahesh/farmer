import { LayoutDashboard, Sprout, MessageSquare, LineChart, Settings, LogOut, Activity } from 'lucide-react'

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics', icon: Activity },
        { id: 'recommend', label: 'Get Advice', icon: Sprout },
        { id: 'advisory', label: 'AI Advisory', icon: MessageSquare },
        { id: 'market', label: 'Market Trends', icon: LineChart },
    ]

    return (
        <aside className="w-64 bg-stone-900 border-r border-stone-800 flex flex-col transition-all duration-300">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-farm-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Sprout className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-stone-400 bg-clip-text text-transparent">
                        Farmer AI
                    </span>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                                ? 'bg-farm-green-500/10 text-farm-green-400 border border-farm-green-500/20'
                                : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200 border border-transparent'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-farm-green-400' : 'group-hover:text-stone-200'}`} />
                            <span className="font-medium">{item.label}</span>
                            {activeTab === item.id && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-farm-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 space-y-2 border-t border-stone-800">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-stone-200 rounded-xl transition-colors">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 rounded-xl transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
