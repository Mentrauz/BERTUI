"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Send, User, Bot, Plus, Settings, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@ai-sdk/react"
import ReactMarkdown from "react-markdown"

export default function ChatPage() {
    const [mounted, setMounted] = useState(false)
    const [input, setInput] = useState("")
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const [isNearBottom, setIsNearBottom] = useState(true)

    const { messages, sendMessage, status } = useChat()

    const isLoading = status === "streaming" || status === "submitted"

    // Handle hydration
    useEffect(() => {
        setMounted(true)
    }, [])

    // Scroll to bottom on new message (only if user is near bottom)
    useEffect(() => {
        if (isNearBottom) {
            scrollToBottom()
        }
    }, [messages, isNearBottom])

    // Handle scroll events to track if user is near bottom
    useEffect(() => {
        const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]')
        if (!scrollContainer) return

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight
            setIsNearBottom(distanceFromBottom < 100)
        }

        scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
        return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }, [])

    // Function to scroll to bottom
    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (scrollContainer) {
                scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight,
                    behavior: 'smooth'
                })
            }
        }
    }

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!input.trim() || isLoading) return

        const messageText = input.trim()
        setInput("")
        await sendMessage({ text: messageText })
    }

    const handleLogout = () => {
        window.location.href = "/login"
    }

    // Markdown components with proper styling hierarchy
    const markdownComponents = {
        h1: ({ children }: any) => (
            <h1 className="text-xl font-bold mt-4 mb-2 text-[#37322F] first:mt-0">{children}</h1>
        ),
        h2: ({ children }: any) => (
            <h2 className="text-lg font-semibold mt-3 mb-2 text-[#37322F]">{children}</h2>
        ),
        h3: ({ children }: any) => (
            <h3 className="text-base font-semibold mt-2 mb-1 text-[#37322F]">{children}</h3>
        ),
        h4: ({ children }: any) => (
            <h4 className="text-sm font-semibold mt-2 mb-1 text-[#37322F]">{children}</h4>
        ),
        p: ({ children }: any) => (
            <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
        ),
        ul: ({ children }: any) => (
            <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>
        ),
        ol: ({ children }: any) => (
            <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>
        ),
        li: ({ children }: any) => (
            <li className="leading-relaxed">{children}</li>
        ),
        code: ({ inline, children }: any) => (
            inline ? (
                <code className="bg-[#37322F]/10 px-1.5 py-0.5 rounded text-sm font-mono text-[#37322F]">{children}</code>
            ) : (
                <code className="block bg-[#37322F]/5 p-3 rounded-lg text-sm font-mono overflow-x-auto my-2 border border-[rgba(55,50,47,0.12)]">{children}</code>
            )
        ),
        pre: ({ children }: any) => (
            <pre className="bg-[#37322F]/5 p-3 rounded-lg text-sm font-mono overflow-x-auto my-2 border border-[rgba(55,50,47,0.12)]">{children}</pre>
        ),
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-[#37322F]/30 pl-4 italic my-2 text-[#605A57]">{children}</blockquote>
        ),
        strong: ({ children }: any) => (
            <strong className="font-semibold text-[#37322F]">{children}</strong>
        ),
        em: ({ children }: any) => (
            <em className="italic">{children}</em>
        ),
        a: ({ href, children }: any) => (
            <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
        ),
        hr: () => (
            <hr className="my-4 border-[rgba(55,50,47,0.12)]" />
        ),
        table: ({ children }: any) => (
            <div className="overflow-x-auto my-2">
                <table className="min-w-full border-collapse border border-[rgba(55,50,47,0.12)] text-sm">{children}</table>
            </div>
        ),
        th: ({ children }: any) => (
            <th className="border border-[rgba(55,50,47,0.12)] px-3 py-2 bg-[#37322F]/5 font-semibold text-left">{children}</th>
        ),
        td: ({ children }: any) => (
            <td className="border border-[rgba(55,50,47,0.12)] px-3 py-2">{children}</td>
        ),
    }

    // Helper to render message parts with markdown
    const renderMessageParts = (message: typeof messages[0]) => {
        if (message.parts && message.parts.length > 0) {
            return message.parts.map((part: any, i) => {
                switch (part.type) {
                    case 'text':
                        return (
                            <div key={`${message.id}-${i}`} className="prose prose-sm max-w-none">
                                <ReactMarkdown components={markdownComponents}>
                                    {part.text}
                                </ReactMarkdown>
                            </div>
                        )
                    case 'tool-weather':
                        if (part.result) {
                            return (
                                <div key={`${message.id}-${i}`} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 mt-2">
                                    <div className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1">🌤️ Weather Tool</div>
                                    <div className="font-medium">{part.result.location}: {part.result.temperature}°F</div>
                                </div>
                            )
                        }
                        return (
                            <div key={`${message.id}-${i}`} className="text-sm text-[#605A57] italic mt-2">
                                Fetching weather...
                            </div>
                        )
                    case 'tool-convertFahrenheitToCelsius':
                        if (part.result) {
                            return (
                                <div key={`${message.id}-${i}`} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800 mt-2">
                                    <div className="text-xs uppercase tracking-wide text-green-600 dark:text-green-400 mb-1">🌡️ Temperature Conversion</div>
                                    <div className="font-medium">{part.result.celsius}°C</div>
                                </div>
                            )
                        }
                        return (
                            <div key={`${message.id}-${i}`} className="text-sm text-[#605A57] italic mt-2">
                                Converting temperature...
                            </div>
                        )
                    default:
                        if ('text' in part && typeof part.text === 'string') {
                            return (
                                <div key={`${message.id}-${i}`} className="prose prose-sm max-w-none">
                                    <ReactMarkdown components={markdownComponents}>
                                        {part.text}
                                    </ReactMarkdown>
                                </div>
                            )
                        }
                        return null
                }
            })
        }

        return <div className="text-[#605A57] italic">No content</div>
    }

    return (
        <div className="w-full h-screen h-[100dvh] bg-[#F7F5F3] flex flex-col relative overflow-hidden">
            {/* Background patterns matching the landing page */}
            <div className="hidden md:block w-full max-w-[1060px] lg:w-[1060px] fixed h-full pointer-events-none z-0 left-1/2 -translate-x-1/2">
                <div className="w-[1px] h-full absolute left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white]"></div>
                <div className="w-[1px] h-full absolute right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white]"></div>
            </div>

            {/* Top Navigation */}
            <header className="relative z-20 h-14 sm:h-16 border-b border-[rgba(55,50,47,0.12)] bg-[#F7F5F3]/80 backdrop-blur-md flex items-center justify-center px-3 sm:px-4 md:px-8 flex-shrink-0">
                <div className="w-full max-w-[1060px] flex justify-between items-center">
                    <Link href="/" className="text-[#2F3037] text-lg sm:text-xl font-medium font-sans">
                        StructBERT <span className="hidden sm:inline text-[10px] uppercase tracking-widest opacity-50 ml-1">DS&A Assistant</span>
                    </Link>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button variant="ghost" size="icon" className="text-[#605A57] hover:text-[#37322F] h-9 w-9 sm:h-10 sm:w-10">
                            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-full border-[rgba(55,50,47,0.12)] bg-white hover:bg-[rgba(55,50,47,0.02)] hidden sm:flex items-center gap-2 text-[#37322F] font-sans text-sm"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="sm:hidden text-[#605A57] hover:text-[#37322F] h-9 w-9"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-hidden flex flex-col items-center relative z-10 min-h-0">
                <div className="w-full max-w-[800px] h-full flex flex-col px-3 sm:px-4 py-4 sm:py-6 md:py-8">
                    {/* Welcome message when no messages */}
                    {messages.length === 0 && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center px-4">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#37322F] text-white flex items-center justify-center">
                                    <Bot className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-semibold text-[#37322F] mb-2">Welcome to StructBERT</h2>
                                <p className="text-[#605A57] text-sm sm:text-base max-w-md">
                                    I&apos;m a specialized Technical Knowledge Retrieval system for Data Structures and Algorithms. How can I assist you today?
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Message Area */}
                    {messages.length > 0 && (
                        <ScrollArea
                            ref={scrollAreaRef}
                            className="flex-1 pr-2 sm:pr-4 mb-4 sm:mb-6 relative min-h-0 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[rgba(55,50,47,0.3)] [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb]:hover:bg-[rgba(55,50,47,0.5)]"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgba(55,50,47,0.3) transparent',
                                scrollBehavior: 'smooth'
                            }}
                        >
                            <div className="space-y-4 sm:space-y-6 md:space-y-8 py-2 sm:py-4 min-h-full">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-2 sm:gap-3 md:gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                    >
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0
                                            ${message.role === "user" ? "bg-[#37322F] text-white" : "bg-white text-[#37322F]"}`}>
                                            {message.role === "user" ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5" />}
                                        </div>
                                        <div className={`flex flex-col max-w-[85%] sm:max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                                            <div className={`p-3 sm:p-4 rounded-2xl font-sans text-sm leading-relaxed shadow-sm overflow-x-auto
                                                ${message.role === "user"
                                                    ? "bg-[#37322F] text-white rounded-tr-none"
                                                    : "bg-white/70 backdrop-blur-sm text-[#37322F] border border-[rgba(55,50,47,0.12)] rounded-tl-none"}`}>
                                                {renderMessageParts(message)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-2 sm:gap-3 md:gap-4">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#37322F] flex items-center justify-center border-2 border-white shadow-sm">
                                            <Bot className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                                        </div>
                                        <div className="bg-white/50 backdrop-blur-sm border border-[rgba(55,50,47,0.06)] p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-[#37322F]/30 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-1.5 h-1.5 bg-[#37322F]/30 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-1.5 h-1.5 bg-[#37322F]/30 rounded-full animate-bounce"></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Scroll to Bottom Button */}
                            {!isNearBottom && (
                                <button
                                    onClick={scrollToBottom}
                                    className="fixed bottom-24 sm:bottom-28 right-4 sm:right-8 bg-[#37322F] text-white p-2 rounded-full shadow-lg hover:bg-[#2a2522] transition-colors duration-200 z-20"
                                    aria-label="Scroll to bottom"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            )}
                        </ScrollArea>
                    )}

                    {/* Input Area */}
                    <div className="relative group flex-shrink-0 mt-auto">
                        <div className="absolute inset-0 bg-white/40 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <form
                            onSubmit={handleSendMessage}
                            className="relative flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 bg-white/90 backdrop-blur-md rounded-full border border-[rgba(55,50,47,0.12)] shadow-[0px_8px_24px_rgba(55,50,47,0.08)]"
                        >
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-[#605A57] hover:bg-[#F7F5F3] h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about DS & Algorithms..."
                                className="border-none bg-transparent focus-visible:ring-0 text-[#37322F] font-sans placeholder:text-[#605A57]/50 text-sm sm:text-base h-8 sm:h-10"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="rounded-full bg-[#37322F] text-white w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 transition-transform active:scale-90"
                                disabled={!input.trim() || isLoading}
                            >
                                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Button>
                        </form>
                        <p className="text-[9px] sm:text-[10px] text-[#605A57] text-center mt-2 sm:mt-3 font-medium font-sans opacity-40">
                            Powered by StructBERT with AI SDK Streaming
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
