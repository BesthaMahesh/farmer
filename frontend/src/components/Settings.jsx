import { useState } from 'react'
import { updateProfile } from 'firebase/auth'
import {
    User, MapPin, Globe, Bell, Palette, Shield, Download, Trash2, Cpu,
    ChevronDown, Save, Smartphone, Clock, FileText, Check, AlertTriangle
} from 'lucide-react'

const Settings = ({ user }) => {
    const [activeTab, setActiveTab] = useState('profile')
    const [saved, setSaved] = useState(false)
    const [fullName, setFullName] = useState(user?.displayName || '')

    const handleSave = async () => {
        try {
            let reloaded = false;
            if (user && fullName !== user.displayName) {
                await updateProfile(user, { displayName: fullName });
                reloaded = true;
                window.location.reload();
            }
            if (!reloaded) {
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
            }
        } catch (error) {
            console.error("Error saving profile", error);
        }
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'regional', label: 'Language & Region', icon: Globe },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'data', label: 'Data & Reports', icon: FileText },
    ]

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                        Settings
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Manage your account, preferences, and AI engine settings.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl ${saved ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'}`}
                >
                    {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                    {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Settings Sidebar */}
                <div className="lg:w-72 shrink-0 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold tracking-wide ${activeTab === tab.id
                                ? 'bg-white shadow-xl shadow-slate-200/40 text-green-600 border border-slate-100'
                                : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent'
                                }`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-green-500' : ''}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Settings Content Area */}
                <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/40 min-h-[600px]">

                    {/* 1. Profile Management */}
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 mb-1">Profile Details</h2>
                                <p className="text-slate-500 text-sm font-medium">Update your personal and farm information for better recommendations.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Add your name..." className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-slate-800 font-bold transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Contact</label>
                                    <input type="text" defaultValue={user?.phoneNumber || user?.email || ''} readOnly className="w-full bg-slate-100 border border-slate-200 px-4 py-3 rounded-xl outline-none text-slate-500 font-bold opacity-70 cursor-not-allowed" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Farm Location</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                                        <input type="text" placeholder="Search farm location..." className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-slate-800 font-bold transition-all" />
                                        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 shadow-sm transition-all">Pick on Map</button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Farm Size</label>
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="0" className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-slate-800 font-bold transition-all" />
                                        <select className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-slate-800 font-bold appearance-none cursor-pointer">
                                            <option>Acres</option>
                                            <option>Hectares</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Soil Type</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-slate-800 font-bold appearance-none cursor-pointer">
                                        <option>Red Soil</option>
                                        <option>Black Cotton Soil</option>
                                        <option>Alluvial Soil</option>
                                        <option>Sandy Soil</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Language & Region */}
                    {activeTab === 'regional' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 mb-1">Language & Localization</h2>
                                <p className="text-slate-500 text-sm font-medium">Customize the platform's format to match your location.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="p-5 border border-slate-100 bg-slate-50 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-900">Interface Language</h4>
                                        <p className="text-sm text-slate-500 font-medium mt-1">Select your primary reading language.</p>
                                    </div>
                                    <select className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-slate-700 shadow-sm cursor-pointer outline-none focus:border-green-500">
                                        <option>English (US)</option>
                                        <option>తెలుగు (Telugu)</option>
                                        <option>हिंदी (Hindi)</option>
                                    </select>
                                </div>
                                <div className="p-5 border border-slate-100 bg-slate-50 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-900">Unit System</h4>
                                        <p className="text-sm text-slate-500 font-medium mt-1">Temperature and rainfall measurement units.</p>
                                    </div>
                                    <select className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-slate-700 shadow-sm cursor-pointer outline-none focus:border-green-500">
                                        <option>Metric (°C, mm)</option>
                                        <option>Imperial (°F, inches)</option>
                                    </select>
                                </div>
                                <div className="p-5 border border-slate-100 bg-slate-50 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-900">Currency Display</h4>
                                        <p className="text-sm text-slate-500 font-medium mt-1">Used in market trends and profit estimator.</p>
                                    </div>
                                    <select className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-slate-700 shadow-sm cursor-pointer outline-none focus:border-green-500">
                                        <option>INR (₹)</option>
                                        <option>USD ($)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. Notifications */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 mb-1">Smart Notifications</h2>
                                <p className="text-slate-500 text-sm font-medium">Control what you get pinged about to avoid alert fatigue.</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: 'Rain Alerts', desc: 'Get notified 24h before heavy rainfall.', active: true },
                                    { title: 'Price Increase Alerts', desc: 'When your crops surge in local mandis.', active: true },
                                    { title: 'Disease Outbreak Alerts', desc: 'Warnings for regional crop infestations.', active: true },
                                    { title: 'Fertilizer Reminder', desc: 'Scheduled calendar reminders for feeding.', active: false },
                                ].map((alert, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{alert.title}</h4>
                                            <p className="text-sm text-slate-500 font-medium mt-1">{alert.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked={alert.active} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-slate-100 mt-6">
                                <h4 className="font-bold text-slate-900 mb-4">Notification Frequency</h4>
                                <div className="flex gap-4">
                                    <button className="flex-1 py-3 bg-white border border-green-500 text-green-600 rounded-xl font-bold shadow-sm shadow-green-500/10">Daily Summary</button>
                                    <button className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl font-bold transition-all">Weekly Digest</button>
                                    <button className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl font-bold transition-all">Instant Alerts</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. Appearance */}
                    {activeTab === 'appearance' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 mb-1">Theme Customization</h2>
                                <p className="text-slate-500 text-sm font-medium">Make the platform look exactly how you want it.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-6 border-2 border-green-500 bg-white rounded-2xl text-left relative overflow-hidden shadow-lg shadow-green-500/10 mb-4 h-32 flex flex-col justify-end">
                                    <div className="absolute top-4 right-4 bg-green-500 rounded-full p-1 text-white">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    <h4 className="font-bold text-slate-900">Light Mode</h4>
                                    <p className="text-xs text-slate-500 mt-1">Crisp and neo-brutal</p>
                                </button>
                                <button className="p-6 border-2 border-slate-200 bg-slate-900 rounded-2xl text-left relative overflow-hidden mb-4 h-32 flex flex-col justify-end group hover:border-slate-700 transition-all">
                                    <h4 className="font-bold text-white">Dark Mode</h4>
                                    <p className="text-xs text-slate-400 mt-1">Easy on the eyes</p>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl">
                                    <div>
                                        <h4 className="font-bold text-slate-900">Compact Mode</h4>
                                        <p className="text-sm text-slate-500 font-medium mt-1">Smaller paddings for mobile optimization.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 5. Security */}
                    {activeTab === 'security' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 mb-1">Security & Login</h2>
                                <p className="text-slate-500 text-sm font-medium">Keep your professional farm data safe and secure.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-6 border border-slate-100 bg-slate-50 rounded-2xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-slate-900">Change Password</h4>
                                            <p className="text-sm text-slate-500 font-medium mt-1">Update your password regularly for security.</p>
                                        </div>
                                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100 transition-all">Update</button>
                                    </div>
                                </div>

                                <div className="p-6 border border-slate-100 bg-slate-50 rounded-2xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-slate-900">Two-Factor Auth (2FA)</h4>
                                            <p className="text-sm text-slate-500 font-medium mt-1">Require an SMS code during login.</p>
                                            <span className="inline-block mt-2 text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-100 px-2 py-1 rounded-md">Not Enabled</span>
                                        </div>
                                        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md">Setup 2FA</button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 mt-6">
                                <h4 className="font-bold text-slate-900 mb-4">Device Management</h4>
                                <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Smartphone className="w-5 h-5" /></div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">Chrome on Windows</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Nandyal, IN • Currently Active</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md">Current</span>
                                </div>
                            </div>
                        </div>
                    )}



                    {/* 7. Data & Reports */}
                    {activeTab === 'data' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 mb-1">Export Data</h2>
                                <p className="text-slate-500 text-sm font-medium">Download your records for offline archiving or banking.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button className="flex items-center gap-4 p-5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 rounded-2xl transition-all shadow-sm group">
                                    <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-slate-900">Soil Report (.PDF)</h4>
                                        <p className="text-slate-500 text-xs mt-0.5">Last 3 months analysis</p>
                                    </div>
                                </button>
                                <button className="flex items-center gap-4 p-5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 rounded-2xl transition-all shadow-sm group">
                                    <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <Download className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-slate-900">Profit Sheet (.CSV)</h4>
                                        <p className="text-slate-500 text-xs mt-0.5">Compatible with Excel</p>
                                    </div>
                                </button>
                            </div>

                            <div className="pt-10 mt-10 border-t border-red-100">
                                <div className="p-6 bg-red-50 border border-red-100 rounded-2xl">
                                    <h4 className="flex items-center gap-2 font-black text-red-600 mb-2">
                                        <AlertTriangle className="w-5 h-5" /> Danger Zone
                                    </h4>
                                    <p className="text-sm text-red-500/80 font-medium mb-6">Permanently delete your account and wipe all historical farm data from AI servers.</p>
                                    <button className="bg-white border border-red-200 text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">Delete Account</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default Settings
