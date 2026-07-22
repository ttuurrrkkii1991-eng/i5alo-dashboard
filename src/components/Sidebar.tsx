"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Settings, MessageSquare, Diamond, Eye, Shield, Link as LinkIcon, 
    Star, Users, Clock, Palette, CheckCircle2, Crown, Bot,
    ChevronDown, ShieldAlert, FileClock, Wrench, FileText
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarItemProps {
    icon: any;
    title: string;
    href: string;
    featureId?: string;
    enabled?: boolean;
    onToggle?: (featureId: string, newState: boolean) => void;
}

const SidebarItem = ({ icon: Icon, title, href, featureId, enabled = false, onToggle }: SidebarItemProps) => {
    const pathname = usePathname();
    const active = pathname === href;
    
    return (
        <div className={clsx(
            "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group",
            active ? "bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]" : "hover:bg-white/5"
        )}>
            <Link href={href || "#"} className="flex items-center gap-3 flex-1">
                <Icon className={clsx("w-5 h-5 transition-colors", active ? "text-white" : "text-gray-400 group-hover:text-gray-200")} />
                <span className={clsx("font-medium transition-colors", active ? "text-white" : "text-gray-300 group-hover:text-white")}>
                    {title}
                </span>
            </Link>
            {featureId && (
                <div 
                    onClick={() => {
                        if (onToggle) onToggle(featureId, !enabled);
                    }}
                    className={clsx(
                        "w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110 shrink-0",
                        enabled ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-white/10 border border-white/20 hover:border-white/40"
                    )}
                >
                    {enabled && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
            )}
        </div>
    );
};

interface SidebarSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const SidebarSection = ({ title, children, defaultOpen = true }: SidebarSectionProps) => {
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
    const [guild, setGuild] = useState<any>({ name: "جاري التحميل...", id: null, icon: null });
    const [features, setFeatures] = useState<Record<string, boolean>>({});
    
    useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.guild) {
                    setGuild(data.guild);
                    // Fetch features for this guild
                    fetch(`/api/features?guildId=${data.guild.id}`)
                        .then(res => res.json())
                        .then(fData => {
                            if (fData.features) setFeatures(fData.features);
                        })
                        .catch(console.error);
                } else {
                    setGuild({ name: "لا توجد صلاحيات", id: null, icon: null });
                }
            })
            .catch(() => setGuild({ name: "لا توجد صلاحيات", id: null, icon: null }));
    }, []);

    const handleToggle = async (featureId: string, newState: boolean) => {
        if (!guild.id) return;
        
        // Optimistic update
        setFeatures(prev => ({ ...prev, [featureId]: newState }));
        
        try {
            const res = await fetch('/api/features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guildId: guild.id, featureId, enabled: newState })
            });
            if (!res.ok) throw new Error('Failed to update');
        } catch (error) {
            console.error('Failed to toggle feature', error);
            // Revert on error
            setFeatures(prev => ({ ...prev, [featureId]: !newState }));
        }
    };

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
                    <SidebarItem href="/commands" icon={Settings} title="الأوامر العامة" featureId="commands" enabled={features['commands']} onToggle={handleToggle} />
                    <SidebarItem href="/welcome" icon={Users} title="الترحيب & المغادرة" featureId="welcome" enabled={features['welcome']} onToggle={handleToggle} />
                    <SidebarItem href="/autoreply" icon={MessageSquare} title="الرد التلقائي" featureId="autoreply" enabled={features['autoreply']} onToggle={handleToggle} />
                    <SidebarItem href="/levels" icon={Star} title="نظام اللفلات" featureId="levels" enabled={features['levels']} onToggle={handleToggle} />
                    <SidebarItem href="/autoroles" icon={Bot} title="الرولات التلقائية" featureId="autoroles" enabled={features['autoroles']} onToggle={handleToggle} />
                    <SidebarItem href="/colors" icon={Palette} title="الألوان" featureId="colors" enabled={features['colors']} onToggle={handleToggle} />
                    <SidebarItem href="/claimable-roles" icon={Users} title="الرولات القابلة للأخذ" featureId="claimable-roles" enabled={features['claimable-roles']} onToggle={handleToggle} />
                    <SidebarItem href="/starboard" icon={Star} title="ستاربورد" featureId="starboard" enabled={features['starboard']} onToggle={handleToggle} />
                    <SidebarItem href="/temp-channels" icon={Clock} title="الرومات المؤقتة" featureId="temp-channels" enabled={features['temp-channels']} onToggle={handleToggle} />
                    <SidebarItem href="/custom-link" icon={LinkIcon} title="الرابط" />
                    <SidebarItem href="/statistics" icon={Star} title="Statistics" featureId="statistics" enabled={features['statistics']} onToggle={handleToggle} />
                    <SidebarItem href="/tickets" icon={MessageSquare} title="التذاكر" featureId="tickets" enabled={features['tickets']} onToggle={handleToggle} />
                    <SidebarItem href="/applications" icon={FileClock} title="التقديمات (Forms)" featureId="applications" enabled={features['applications']} onToggle={handleToggle} />
                </SidebarSection>

                <SidebarSection title="الإشراف">
                    <SidebarItem href="/moderation" icon={Settings} title="الإشراف" featureId="moderation" enabled={features['moderation']} onToggle={handleToggle} />
                    <SidebarItem href="/logs" icon={FileClock} title="اللوق" featureId="logs" enabled={features['logs']} onToggle={handleToggle} />
                    <SidebarItem href="/automod" icon={Bot} title="الرقابة التلقائية" featureId="automod" enabled={features['automod']} onToggle={handleToggle} />
                    <SidebarItem href="/anti-raid" icon={ShieldAlert} title="مكافحة الغزو" featureId="anti-raid" enabled={features['anti-raid']} onToggle={handleToggle} />
                    <SidebarItem href="/special-protection" icon={Shield} title="الحماية الخاصة" featureId="special-protection" enabled={features['special-protection']} onToggle={handleToggle} />
                </SidebarSection>

                <SidebarSection title="اخرى">
                    <SidebarItem href="/dashboard-logs" icon={Wrench} title="سجل لوحة التحكم" />
                    <SidebarItem href="/moderator-actions" icon={FileText} title="اجراءات المراقب" />
                </SidebarSection>

            </div>
        </aside>
    );
}

