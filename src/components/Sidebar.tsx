"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Settings, MessageSquare, Diamond, Eye, Shield, Link as LinkIcon, 
    Star, Users, Clock, Palette, CheckCircle2, Crown, Bot,
    ChevronDown, ShieldAlert, FileClock
} from 'lucide-react';
import clsx from 'clsx';

const SidebarItem = ({ icon: Icon, title, href, enabled = false }) => {
    const pathname = usePathname();
    const active = pathname === href;
    
    return (
        <Link href={href || "#"} className={clsx(
            "flex items-center justify-between px-4 py-3 cursor-pointer rounded-xl transition-all duration-300 group",
            active ? "bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]" : "hover:bg-white/5"
        )}>
            <div className="flex items-center gap-3">
                <Icon className={clsx("w-5 h-5 transition-colors", active ? "text-white" : "text-gray-400 group-hover:text-gray-200")} />
                <span className={clsx("font-medium transition-colors", active ? "text-white" : "text-gray-300 group-hover:text-white")}>
                    {title}
                </span>
            </div>
            {enabled && (
                <div className="bg-emerald-500 rounded-full p-0.5 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
            )}
        </Link>
    );
};

const SidebarSection = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-6">
            <div 
                className="flex items-center justify-between px-4 mb-2 cursor-pointer text-gray-500 hover:text-gray-300 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
                <ChevronDown className={clsx("w-4 h-4 transition-transform duration-300", isOpen ? "rotate-180" : "")} />
            </div>
            <div className={clsx("space-y-1 overflow-hidden transition-all duration-300", isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0")}>
                {children}
            </div>
        </div>
    );
};

export default function Sidebar() {
    const [guild, setGuild] = useState({ name: "جاري التحميل...", id: null, icon: null });
    
    React.useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.guild) setGuild(data.guild);
            })
            .catch(() => setGuild({ name: "سيرفر غير معروف", id: null, icon: null }));
    }, []);

    const iconUrl = guild.icon 
        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` 
        : null;

    return (
        <aside className="w-72 h-screen bg-[#2b2d31] border-l border-white/5 flex flex-col shadow-2xl relative z-10">
            {/* Logo/Server Header */}
            <div className="h-20 flex items-center px-6 border-b border-white/5 bg-gradient-to-r from-transparent to-white/[0.02]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0 overflow-hidden">
                    {iconUrl ? (
                        <img src={iconUrl} alt={guild.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-white font-bold text-xl">{guild.name.charAt(0) || 'S'}</span>
                    )}
                </div>
                <div className="mr-4 overflow-hidden">
                    <h2 className="text-white font-bold text-lg leading-tight truncate">{guild.name}</h2>
                    <p className="text-gray-400 text-xs">إدارة البوت</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                
                <SidebarSection title="عام">
                    <SidebarItem href="/" icon={Eye} title="نظرة عامة" />
                    <SidebarItem href="/settings" icon={Settings} title="إعدادات السيرفر" />
                    <SidebarItem href="/embeds" icon={MessageSquare} title="رسائل الإيمبد" />
                    <SidebarItem href="#" icon={Diamond} title="اشتراكات البريميوم" />
                </SidebarSection>

                <SidebarSection title="قائمة الخصائص">
                    <SidebarItem href="/commands" icon={Settings} title="الأوامر العامة" enabled={true} />
                    <SidebarItem href="/welcome" icon={Users} title="الترحيب & المغادرة" enabled={true} />
                    <SidebarItem href="/autoreply" icon={MessageSquare} title="الرد التلقائي" enabled={true} />
                    <SidebarItem href="/levels" icon={Star} title="نظام اللفلات" enabled={true} />
                    <SidebarItem href="/autoroles" icon={Bot} title="الرولات التلقائية" enabled={true} />
                    <SidebarItem href="/colors" icon={Palette} title="الألوان" enabled={true} />
                    <SidebarItem href="/claimable-roles" icon={Users} title="الرولات القابلة للأخذ" enabled={true} />
                    <SidebarItem href="/starboard" icon={Star} title="ستاربورد" enabled={true} />
                    <SidebarItem href="/temp-channels" icon={Clock} title="الرومات المؤقتة" enabled={true} />
                    <SidebarItem href="/custom-link" icon={LinkIcon} title="الرابط" />
                    <SidebarItem href="/statistics" icon={Star} title="Statistics" enabled={true} />
                    <SidebarItem href="/tickets" icon={MessageSquare} title="التذاكر" enabled={true} />
                </SidebarSection>

                <SidebarSection title="الإشراف">
                    <SidebarItem href="/moderation" icon={Settings} title="الإشراف" enabled={true} />
                    <SidebarItem href="/logs" icon={FileClock} title="اللوق" enabled={true} />
                    <SidebarItem href="/automod" icon={Bot} title="الرقابة التلقائية" enabled={true} />
                    <SidebarItem href="/anti-raid" icon={ShieldAlert} title="مكافحة الغزو" enabled={true} />
                    <SidebarItem href="/special-protection" icon={Shield} title="الحماية الخاصة" enabled={true} />
                </SidebarSection>

            </div>
        </aside>
    );
}
