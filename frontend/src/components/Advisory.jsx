import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Sparkles, User, Loader2, Image as ImageIcon, X, Camera } from 'lucide-react'
import axios from 'axios'

const Advisory = ({ setLastDetection }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your AI Agricultural Assistant. How can I help you with your crops today?" }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const chatEndRef = useRef(null)
    const fileInputRef = useRef(null)

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setSelectedImage(null)
        setImagePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if ((!input.trim() && !selectedImage) || loading) return

        const userMsg = input
        const userImg = imagePreview

        setInput('')
        removeImage()

        setMessages(prev => [...prev, {
            role: 'user',
            content: userMsg,
            image: userImg
        }])
        setLoading(true)

        try {
            if (userImg && selectedImage) {
                // Handle Image Detection
                const formData = new FormData()
                formData.append('image', selectedImage)

                const response = await axios.post('http://localhost:5000/api/detect-disease', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })

                const { disease, confidence } = response.data
                const resultMsg = `I've analyzed your image. The plant appears to have **${disease}** with about **${(confidence * 100).toFixed(1)}%** confidence.`

                setMessages(prev => [...prev, { role: 'assistant', content: resultMsg }])

                // Update Global Detection State
                if (setLastDetection) {
                    setLastDetection({
                        disease,
                        confidence,
                        image: userImg,
                        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
                        timestamp: new Date().toISOString()
                    })
                }
            } else {
                // Normal Text Question
                const response = await axios.post('http://localhost:5000/api/ask-ai', { question: userMsg })
                setMessages(prev => [...prev, { role: 'assistant', content: response.data.answer }])
            }
        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please ensure the backend is running and the model is trained." }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="p-6 border-b border-stone-800 flex items-center gap-4 bg-stone-900/50 backdrop-blur-xl">
                <div className="p-2 bg-farm-green-500/10 rounded-xl text-farm-green-400">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">AI Expert Advisor</h2>
                    <p className="text-stone-500 text-sm">Powered by GPT-3.5 Turbo</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-stone-800 text-stone-300' : 'bg-farm-green-500/10 text-farm-green-400'
                                }`}>
                                {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
                            </div>
                            <div className={`p-4 rounded-2xl ${msg.role === 'user'
                                ? 'bg-farm-green-600 text-white rounded-tr-none'
                                : 'bg-stone-950 text-stone-200 border border-stone-800 rounded-tl-none'
                                } shadow-lg`}>
                                {msg.image && (
                                    <img src={msg.image} alt="Uploaded" className="max-w-xs rounded-xl mb-3 border border-white/10" />
                                )}
                                <p className="leading-relaxed whitespace-pre-wrap">
                                    {msg.content}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-xl bg-farm-green-500/10 text-farm-green-400 flex items-center justify-center">
                                <Loader2 size={20} className="animate-spin" />
                            </div>
                            <div className="p-4 rounded-2xl bg-stone-950 text-stone-500 border border-stone-800 rounded-tl-none italic">
                                Expert is thinking...
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-stone-950/50 border-t border-stone-800">
                {imagePreview && (
                    <div className="mb-4 relative inline-block">
                        <img src={imagePreview} className="h-24 w-24 object-cover rounded-xl border-2 border-farm-green-500 shadow-lg shadow-farm-green-500/20" alt="Preview" />
                        <button
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSend} className="relative flex gap-3">
                    <div className="relative flex-1">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-stone-500 hover:text-farm-green-400 transition-colors"
                        >
                            <Camera size={22} />
                        </button>
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <input
                            type="text"
                            className="w-full bg-stone-900 border border-stone-800 rounded-2xl px-6 py-4 pl-12 pr-12 text-white focus:outline-none focus:border-farm-green-500 transition-colors"
                            placeholder={imagePreview ? "Tell me more about this plant or just send..." : "Ask or upload a leaf photo for diagnosis..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={(!input.trim() && !selectedImage) || loading}
                        className="px-6 bg-farm-green-600 hover:bg-farm-green-500 text-white rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-farm-green-500/20 flex items-center justify-center shrink-0"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Advisory
