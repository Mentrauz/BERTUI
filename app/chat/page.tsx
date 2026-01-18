"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Send, User, Bot, Plus, Search, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

export default function ChatPage() {
    const [mounted, setMounted] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Welcome to BERT AI. How can I assist you with your algorithms today?",
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    // Handle hydration
    useEffect(() => {
        setMounted(true)
    }, [])

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight
            }
        }
    }, [messages])

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        // Simulated AI response
        setTimeout(() => {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I've processed your request using BERT's advanced algorithms. The integration is ready for deployment.",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, assistantMessage])
            setIsLoading(false)
        }, 1500)
    }

    const handleLogout = () => {
        window.location.href = "/login"
    }

    return (
        <div className="w-full h-screen bg-[#F7F5F3] flex flex-col relative overflow-hidden">
            {/* Background patterns matching the landing page */}
            <div className="w-full max-w-[1060px] lg:w-[1060px] fixed h-full pointer-events-none z-0 left-1/2 -translate-x-1/2">
                <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white]"></div>
                <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white]"></div>
            </div>

            {/* Top Navigation */}
            <header className="relative z-20 h-16 border-b border-[rgba(55,50,47,0.12)] bg-[#F7F5F3]/80 backdrop-blur-md flex items-center justify-center px-4 md:px-8">
                <div className="w-full max-w-[1060px] flex justify-between items-center">
                    <Link href="/" className="text-[#2F3037] text-xl font-medium font-sans">
                        BERT <span className="text-[10px] uppercase tracking-widest opacity-50 ml-1">AI Chat</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-[#605A57] hover:text-[#37322F]">
                            <Settings className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-full border-[rgba(55,50,47,0.12)] bg-white hover:bg-[rgba(55,50,47,0.02)] hidden sm:flex items-center gap-2 text-[#37322F] font-sans text-sm"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-hidden flex flex-col items-center relative z-10">
                <div className="w-full max-w-[800px] h-full flex flex-col px-4 py-8">
                    {/* Message Area */}
                    <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4 mb-6">
                        <div className="space-y-8 py-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0
                                        ${message.role === "user" ? "bg-[#37322F] text-white" : "bg-white text-[#37322F]"}`}>
                                        {message.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                    </div>
                                    <div className={`flex flex-col max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                                        <div className={`p-4 rounded-2xl font-sans text-sm leading-relaxed shadow-sm
                                            ${message.role === "user"
                                                ? "bg-[#37322F] text-white rounded-tr-none"
                                                : "bg-white/70 backdrop-blur-sm text-[#37322F] border border-[rgba(55,50,47,0.12)] rounded-tl-none"}`}>
                                            {message.content}
                                        </div>
                                        <span className="text-[10px] text-[#605A57] mt-2 font-medium uppercase tracking-tighter opacity-60">
                                            {mounted ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white text-[#37322F] flex items-center justify-center border-2 border-white shadow-sm">
                                        <Bot className="w-5 h-5 animate-pulse" />
                                    </div>
                                    <div className="bg-white/50 backdrop-blur-sm border border-[rgba(55,50,47,0.06)] p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-[#37322F]/30 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-[#37322F]/30 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-[#37322F]/30 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-white/40 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <form
                            onSubmit={handleSendMessage}
                            className="relative flex items-center gap-2 p-2 bg-white/90 backdrop-blur-md rounded-full border border-[rgba(55,50,47,0.12)] shadow-[0px_8px_24px_rgba(55,50,47,0.08)]"
                        >
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-[#605A57] hover:bg-[#F7F5F3]"
                            >
                                <Plus className="w-5 h-5" />
                            </Button>
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask BERT anything..."
                                className="border-none bg-transparent focus-visible:ring-0 text-[#37322F] font-sans placeholder:text-[#605A57]/50"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="rounded-full bg-[#37322F] text-white w-10 h-10 flex-shrink-0 transition-transform active:scale-90"
                                disabled={!input.trim() || isLoading}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                        <p className="text-[10px] text-[#605A57] text-center mt-3 font-medium font-sans opacity-40">
                            Powered by BERT Advanced Algorithmic Intelligence
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
