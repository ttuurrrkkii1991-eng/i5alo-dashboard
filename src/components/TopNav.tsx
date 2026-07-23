"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react";

export default function TopNav() {
    const { data: session, status } = useSession();

    return (
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#313338]/80 backdrop-blur-md sticky top-0 z-50">
            {/* Left side (Logo) */}
            <div className="flex items-center gap-3">
                <img src="/logo.png" alt="i5alo Logo" className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(0,191,255,0.5)]" />
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    i5alo Dashboard
                </span>
            </div>
            
            {/* Right side (Actions) */}
            <div className="flex items-center gap-4">
            </div>
        </header>
    );
}
