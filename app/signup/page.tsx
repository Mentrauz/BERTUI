"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Signup failed")
            }

            setSuccess(true)
            setTimeout(() => {
                window.location.href = "/login"
            }, 2000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-center items-center">
            {/* Background patterns and lines */}
            <div className="w-full max-w-[1060px] lg:w-[1060px] fixed h-full pointer-events-none z-0">
                <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white]"></div>
                <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                <Link
                    href="/"
                    className="absolute -top-12 left-4 flex items-center gap-2 text-[#605A57] hover:text-[#37322F] transition-colors font-sans text-sm font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to home
                </Link>

                <div className="flex flex-col items-center mb-12">
                    <Link href="/" className="flex flex-col justify-center text-[#2F3037] text-2xl sm:text-3xl font-medium leading-5 font-sans mb-8">
                        BERT
                    </Link>
                    <h1 className="text-[#37322F] text-[36px] md:text-[48px] font-normal leading-tight font-serif text-center">
                        Join BERT
                    </h1>
                    <p className="text-[rgba(55,50,47,0.80)] text-base font-medium font-sans mt-2 text-center">
                        Create your account to get started
                    </p>
                </div>

                <Card className="bg-white/70 backdrop-blur-md border-[rgba(55,50,47,0.12)] shadow-[0px_8px_24px_rgba(55,50,47,0.06)] rounded-xl overflow-hidden">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl font-semibold text-[#37322F] font-sans">Create Account</CardTitle>
                        <CardDescription className="text-[#605A57] font-sans">
                            Enter your details to create your BERT account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center font-sans space-y-2">
                                <p className="font-semibold">Successfully registered!</p>
                                <p className="text-sm">Redirecting to login page...</p>
                            </div>
                        ) : (
                            <form onSubmit={onSubmit} className="space-y-4">
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-sans">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-[#37322F] font-sans">
                                        Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="John Doe"
                                        required
                                        className="bg-white border-[rgba(55,50,47,0.12)] focus:ring-[#37322F]/10 focus:border-[#37322F] rounded-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-[#37322F] font-sans">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        className="bg-white border-[rgba(55,50,47,0.12)] focus:ring-[#37322F]/10 focus:border-[#37322F] rounded-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-[#37322F] font-sans">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="bg-white border-[rgba(55,50,47,0.12)] focus:ring-[#37322F]/10 focus:border-[#37322F] rounded-lg"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-[#37322F] hover:bg-[#2F3037] text-white rounded-full py-6 mt-2 font-medium shadow-[0px_4px_12px_rgba(55,50,47,0.1)] transition-all active:scale-[0.98]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Creating account..." : "Sign up"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 bg-[rgba(55,50,47,0.02)] border-t border-[rgba(55,50,47,0.06)] p-6">
                        <p className="text-center text-sm text-[#605A57] font-sans mt-2">
                            Already have an account?{" "}
                            <Link href="/login" className="text-[#37322F] font-semibold hover:underline">
                                Log in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
