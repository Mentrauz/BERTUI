"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    }

    return (
        <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-center items-center">
            {/* Background patterns and lines matching the landing page */}
            <div className="w-full max-w-[1060px] lg:w-[1060px] fixed h-full pointer-events-none z-0">
                <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white]"></div>
                <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                {/* Back Button */}
                <Link
                    href="/"
                    className="absolute -top-12 left-4 flex items-center gap-2 text-[#605A57] hover:text-[#37322F] transition-colors font-sans text-sm font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to home
                </Link>

                {/* Branding */}
                <div className="flex flex-col items-center mb-12">
                    <Link href="/" className="flex flex-col justify-center text-[#2F3037] text-2xl sm:text-3xl font-medium leading-5 font-sans mb-8">
                        BERT
                    </Link>
                    <h1 className="text-[#37322F] text-[36px] md:text-[48px] font-normal leading-tight font-serif text-center">
                        Welcome back
                    </h1>
                    <p className="text-[rgba(55,50,47,0.80)] text-base font-medium font-sans mt-2 text-center">
                        Log in to your BERT account
                    </p>
                </div>

                <Card className="bg-white/70 backdrop-blur-md border-[rgba(55,50,47,0.12)] shadow-[0px_8px_24px_rgba(55,50,47,0.06)] rounded-xl overflow-hidden">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl font-semibold text-[#37322F] font-sans">Login</CardTitle>
                        <CardDescription className="text-[#605A57] font-sans">
                            Enter your email and password to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-[#37322F] font-sans">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    className="bg-white border-[rgba(55,50,47,0.12)] focus:ring-[#37322F]/10 focus:border-[#37322F] rounded-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium text-[#37322F] font-sans">
                                        Password
                                    </Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs text-[#605A57] hover:text-[#37322F] transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
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
                                {isLoading ? "Logging in..." : "Log in"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 bg-[rgba(55,50,47,0.02)] border-t border-[rgba(55,50,47,0.06)] p-6">
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-[rgba(55,50,47,0.1)]" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#FBF9F8] px-2 text-[#605A57] font-medium">Or continue with</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <Button variant="outline" className="border-[rgba(55,50,47,0.12)] bg-white hover:bg-[rgba(55,50,47,0.02)] rounded-lg">
                                Google
                            </Button>
                            <Button variant="outline" className="border-[rgba(55,50,47,0.12)] bg-white hover:bg-[rgba(55,50,47,0.02)] rounded-lg">
                                Github
                            </Button>
                        </div>
                        <p className="text-center text-sm text-[#605A57] font-sans mt-2">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-[#37322F] font-semibold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                {/* Footer text */}
                <p className="mt-8 text-center text-xs text-[#605A57] font-sans px-8 leading-relaxed">
                    By clicking continue, you agree to our{" "}
                    <Link href="/terms" className="underline hover:text-[#37322F]">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline hover:text-[#37322F]">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}
