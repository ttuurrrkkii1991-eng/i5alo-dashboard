"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react";

export default function TopNav() {
    const { data: session, status } = useSession();

    return (
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#313338]/80 backdrop-blur-md sticky top-0 z-50">
            {/* Left side (empty or breadcrumbs could go here) */}
            <div>
            </div>
            
            {/* Right side (User & Actions) */}
            <div className="flex items-center gap-4">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                    حفظ التغييرات
                </button>
                
                <div 
                    onClick={() => {
                        if (status === "unauthenticated") signIn("discord");
                    }}
                    className="flex items-center gap-3 bg-[#242529] border border-white/5 pl-2 pr-4 py-1.5 rounded-full cursor-pointer hover:bg-[#2a2b2f] transition-colors"
                >
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-white">
                            {status === "loading" ? "جاري التحميل..." : session?.user?.name || "تسجيل الدخول"}
                        </span>
                        <span className="text-[10px] text-gray-400">
                            {session?.user ? "مدير السيرفر" : "اضغط للدخول"}
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-indigo-500 overflow-hidden shrink-0">
                        <img 
                            src={session?.user?.image || "https://cdn.discordapp.com/embed/avatars/0.png"} 
                            alt="User Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
