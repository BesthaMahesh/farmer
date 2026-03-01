import { LayoutDashboard, Sprout, MessageSquare, LineChart, Settings, LogOut, Activity } from 'lucide-react'

const Sidebar = ({ activeTab, setActiveTab, onLogout, isSidebarOpen, setIsSidebarOpen }) => {
    const handleNavigation = (id) => {
        setActiveTab(id);
        if (setIsSidebarOpen) setIsSidebarOpen(false);
    };
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics', icon: Activity },
        { id: 'recommend', label: 'Get Advice', icon: Sprout },
        { id: 'advisory', label: 'Diagnosis & AI Advisor', icon: MessageSquare, badge: 'NEW' },
        { id: 'market', label: 'Market Trends', icon: LineChart },
    ]

    return (
        <aside className={`w-64 bg-white/80 backdrop-blur-3xl border-r border-slate-200 flex flex-col h-full overflow-y-auto shadow-2xl z-50 fixed lg:static top-0 left-0 bottom-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                        <Sprout className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-black text-slate-800 tracking-tight">
                        AgroMind
                    </span>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group font-bold tracking-wide ${activeTab === item.id
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20'
                                : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'group-hover:text-green-600 transition-colors'}`} />
                            <span className="font-medium">{item.label}</span>
                            {item.badge && (
                                <span className="ml-2 px-1.5 py-0.5 text-[8px] font-bold bg-green-500 text-white rounded-md tracking-wider">
                                    {item.badge}
                                </span>
                            )}
                            {activeTab === item.id && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 space-y-2 border-t border-slate-200 bg-slate-50/50">
                <button
                    onClick={() => handleNavigation('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activeTab === 'settings' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
                >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                </button>
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all font-bold">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
