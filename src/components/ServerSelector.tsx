"use client";

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Bot } from 'lucide-react';
import { useSession, signIn } from "next-auth/react";

export default function ServerSelector() {
    const { data: session } = useSession();
    const [guilds, setGuilds] = useState([]);
    const [activeGuild, setActiveGuild] = useState(null);

    useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.allGuilds) {
                    setGuilds(data.allGuilds);
                    if (data.guild) {
                        setActiveGuild(data.guild.id);
                    }
                }
            })
            .catch(console.error);
    }, []);

    return (
        <nav className="w-[72px] h-screen bg-[#1e1f22] flex flex-col items-center py-3 gap-2 shrink-0 z-20">
            
            {/* User Profile / Home */}
            <div 
                className="relative group flex justify-center w-full mb-2 cursor-pointer"
                onClick={() => { if (!session) signIn("discord"); }}
            >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#313338] hover:bg-emerald-500 text-gray-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md overflow-hidden border-2 border-transparent hover:border-indigo-500">
                    {session?.user?.image ? (
                        <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <Bot className="w-7 h-7" />
                    )}
                </div>
                
                {/* Tooltip */}
                <div className="absolute right-[85px] top-1/2 -translate-y-1/2 bg-black text-white text-sm font-bold py-1.5 px-3 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 flex items-center">
                    {session?.user?.name || "تسجيل الدخول"}
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-black"></div>
                </div>
            </div>

            <div className="w-8 h-[2px] bg-white/10 rounded-full mb-2"></div>

            {/* Server List */}
            <div className="flex-1 overflow-y-auto w-full custom-scrollbar flex flex-col items-center gap-2 px-2">
                {guilds.map((guild: any) => {
                    const isActive = activeGuild === guild.id;
                    const iconUrl = guild.icon 
                        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                        : null;

                    return (
                        <div 
                            key={guild.id} 
                            className="relative group flex justify-center w-full cursor-pointer" 
                            onClick={() => {
                                document.cookie = `selectedGuildId=${guild.id}; path=/; max-age=31536000`;
                                setActiveGuild(guild.id);
                                window.location.reload();
                            }}
                        >
                            {/* Active/Hover Indicator */}
                            <div className={clsx(
                                "absolute right-0 top-1/2 -translate-y-1/2 w-1 rounded-l-full transition-all duration-300",
                                isActive ? "h-10 bg-white" : "h-0 bg-white group-hover:h-5 opacity-0 group-hover:opacity-100"
                            )}></div>
                            
                            {/* Server Icon */}
                            <div className={clsx(
                                "w-12 h-12 flex items-center justify-center transition-all duration-300 shadow-md overflow-hidden bg-[#313338] text-gray-300",
                                isActive ? "rounded-[16px] bg-indigo-500 text-white" : "rounded-[24px] group-hover:rounded-[16px] group-hover:bg-indigo-500 group-hover:text-white"
                            )}>
                                {iconUrl ? (
                                    <img src={iconUrl} alt={guild.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-bold text-sm">
                                        {guild.name.charAt(0)}
                                    </span>
                                )}
                            </div>

                            {/* Tooltip */}
                            <div className="absolute right-[85px] top-1/2 -translate-y-1/2 bg-black text-white text-sm font-bold py-1.5 px-3 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 flex items-center">
                                {guild.name}
                                <div className="absolute -right-1 top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-black"></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}
