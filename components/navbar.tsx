"use client";

import Link from "next/link";
import { Rocket, Shield, Sparkles, Trophy, Zap } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";


export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#131313]/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#ff007a]/50 bg-[#ff007a]/15 shadow-[0_0_24px_rgba(255,0,122,0.35)]">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">DevPulse</span>
                        </div>
                    </Link>
                    <Link href="/projects" className="hidden items-center gap-1 text-sm text-zinc-300 hover:text-cyan-300 md:flex">
                        <Zap className="h-4 w-4" />
                        Trending
                    </Link>
                    <Link href="/leaderboards" className="hidden items-center gap-1 text-sm text-zinc-300 hover:text-cyan-300 lg:flex">
                        <Trophy className="h-4 w-4" />
                        Leaderboards
                    </Link>
                    <Link href="/projects/new" className="hidden items-center gap-1 text-sm text-zinc-300 hover:text-cyan-300 md:flex">
                        <Rocket className="h-4 w-4" />
                        Launch
                    </Link>
                    {/* Admin Link */}
                    <Show when="signed-in">
                        <Link href="/admin" className="flex items-center text-sm text-zinc-300 transition-colors hover:text-cyan-300">
                            <Shield className="h-4 w-4"/>Admin
                        </Link>
                    </Show>
                </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Show when="signed-out">
                        <SignInButton>
                            <Button asChild className="bg-[#ff007a] text-white shadow-[0_0_20px_rgba(255,0,122,0.35)] hover:bg-[#e6006e]">
                            <Link href="/sign-in">Sign In</Link>
                            </Button>
                        </SignInButton>
                        </Show>
                        <Show when="signed-in">
                        <UserButton />
                        </Show>
                    </div>
                </div>
        </nav>
    );
}
