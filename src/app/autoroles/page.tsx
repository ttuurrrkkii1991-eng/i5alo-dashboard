"use client";

import React, { useState, useEffect } from 'react';
import { Bot, Save, Users, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function AutoRolesPage() {
    const [guildId, setGuildId] = useState<string | null>(null);
    const [enabled, setEnabled] = useState(false);
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [humanRoles, setHumanRoles] = useState<any[]>([]);
    const [botRoles, setBotRoles] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.roles) {
                    setRoles(data.roles);
                }
                if (data.guild) {
                    setGuildId(data.guild.id);
                }
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (!guildId || roles.length === 0) return;
        setLoading(true);
        fetch(`/api/settings/auto-role?guildId=${guildId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.settings) {
                    setEnabled(data.settings.enabled);
                    
                    // Map Role IDs back to full role objects for display
                    const hRoles = (data.settings.humanRoles || []).map((id: string) => roles.find(r => r.id === id)).filter(Boolean);
                    const bRoles = (data.settings.botRoles || []).map((id: string) => roles.find(r => r.id === id)).filter(Boolean);
                    
                    setHumanRoles(hRoles);
                    setBotRoles(bRoles);
                }
            })
            .finally(() => setLoading(false));
    }, [guildId, roles]);

    const saveSettings = async (newEnabled: boolean, newHumanRoles: any[], newBotRoles: any[]) => {
        if (!guildId) return;
        setSaving(true);
        try {
            await fetch('/api/settings/auto-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    guildId, 
                    enabled: newEnabled, 
                    humanRoles: newHumanRoles.map(r => r.id), 
                    botRoles: newBotRoles.map(r => r.id) 
                })
            });
        } catch (e) {
            console.error(e);
        }
        setSaving(false);
    };

    const handleToggle = (newEnabled: boolean) => {
        setEnabled(newEnabled);
        saveSettings(newEnabled, humanRoles, botRoles);
    };

    const addHumanRole = (e: any) => {
        const roleId = e.target.value;
        if (!roleId) return;
        const role = roles.find(r => r.id === roleId);
        if (role && !humanRoles.find(r => r.id === roleId)) {
            const updated = [...humanRoles, role];
            setHumanRoles(updated);
            saveSettings(enabled, updated, botRoles);
        }
        e.target.value = "";
    };

    const addBotRole = (e: any) => {
        const roleId = e.target.value;
        if (!roleId) return;
        const role = roles.find(r => r.id === roleId);
        if (role && !botRoles.find(r => r.id === roleId)) {
            const updated = [...botRoles, role];
            setBotRoles(updated);
            saveSettings(enabled, humanRoles, updated);
        }
        e.target.value = "";
    };

    const removeHumanRole = (id: string) => {
        const updated = humanRoles.filter(r => r.id !== id);
        setHumanRoles(updated);
        saveSettings(enabled, updated, botRoles);
    };

    const removeBotRole = (id: string) => {
        const updated = botRoles.filter(r => r.id !== id);
        setBotRoles(updated);
        saveSettings(enabled, humanRoles, updated);
    };

    if (loading && !guildId) return <div className="text-center pt-20 text-white">جاري التحميل...</div>;

    return (
        <div className="space-y-6">
            
            <div className="glass-panel p-8 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-indigo-400 mb-2 flex items-center gap-2">
                        <Bot className="w-6 h-6" />
                        الرولات التلقائية (Auto Roles)
                    </h2>
                    <p className="text-gray-300 max-w-2xl">
                        يقوم البوت بإعطاء رتب (Roles) معينة بشكل تلقائي لأي عضو جديد يدخل السيرفر، أو للبوتات الجديدة.
                    </p>
                </div>
                
                <div 
                    className={clsx(
                        "w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out shrink-0",
                        enabled ? "bg-indigo-500" : "bg-gray-600"
                    )}
                    onClick={() => handleToggle(!enabled)}
                >
                    <div 
                        className={clsx(
                            "bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out",
                            enabled ? "translate-x-[-28px]" : "translate-x-0"
                        )}
                    />
                </div>
            </div>

            {enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    
                    <div className="glass-panel p-6">
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-400" />
                            رتب الأعضاء (Humans)
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">الرتب التي سيحصل عليها الأعضاء البشريين الجدد.</p>
                        
                        <div className="space-y-3">
                            <select onChange={addHumanRole} disabled={loading} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-indigo-500/50 transition-colors">
                                <option value="">{loading ? 'جاري تحميل الرتب...' : '+ إضافة رتبة للعضو...'}</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id} style={{ color: r.color }}>{r.name}</option>
                                ))}
                            </select>
                            
                            {/* Selected Roles Tags */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {humanRoles.map((r) => (
                                    <div key={r.id} className="bg-indigo-500/20 border border-indigo-500/30 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }}></div>
                                        {r.name}
                                        <button onClick={() => removeHumanRole(r.id)} className="text-gray-400 hover:text-red-400 ml-2">×</button>
                                    </div>
                                ))}
                                {humanRoles.length === 0 && <span className="text-gray-500 text-sm">لم يتم تحديد رتب بعد.</span>}
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6">
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <Bot className="w-5 h-5 text-indigo-400" />
                            رتب البوتات (Bots)
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">الرتب التي سيحصل عليها أي بوت جديد يتم إضافته للسيرفر.</p>
                        
                        <div className="space-y-3">
                            <select onChange={addBotRole} disabled={loading} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-indigo-500/50 transition-colors">
                                <option value="">{loading ? 'جاري تحميل الرتب...' : '+ إضافة رتبة للبوت...'}</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id} style={{ color: r.color }}>{r.name}</option>
                                ))}
                            </select>
                            
                            {/* Selected Roles Tags */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {botRoles.map((r) => (
                                    <div key={r.id} className="bg-indigo-500/20 border border-indigo-500/30 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }}></div>
                                        {r.name}
                                        <button onClick={() => removeBotRole(r.id)} className="text-gray-400 hover:text-red-400 ml-2">×</button>
                                    </div>
                                ))}
                                {botRoles.length === 0 && <span className="text-gray-500 text-sm">لم يتم تحديد رتب بعد.</span>}
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
