"use client";

import React, { useState, useEffect } from 'react';
import { Save, Loader2, PlaySquare, Hash } from 'lucide-react';
import clsx from 'clsx';

const MainToggle = ({ enabled, onChange }: any) => (
    <button
        onClick={() => onChange(!enabled)}
        className={clsx(
            "relative w-16 h-8 rounded-full transition-colors duration-300 shadow-inner flex items-center px-1",
            enabled ? "bg-[#00F2EA]" : "bg-gray-700"
        )}
    >
        <div 
            className={clsx(
                "w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300",
                enabled ? "translate-x-[-32px]" : "translate-x-0"
            )}
        />
    </button>
);

export default function YoutubeBotPage() {
    const [guildId, setGuildId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [globalEnabled, setGlobalEnabled] = useState(false);
    
    const [commandChannelId, setCommandChannelId] = useState('');
    const [textChannels, setTextChannels] = useState([]);

    useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.guild) {
                    setGuildId(data.guild.id);
                    setTextChannels(data.textChannels || []);
                }
            });
    }, []);

    useEffect(() => {
        if (!guildId) return;
        setLoading(true);
        fetch(`/api/features/youtube-bot?guildId=${guildId}`)
            .then(res => res.json())
            .then(data => {
                if (data.settings) {
                    setGlobalEnabled(data.settings.enabled);
                    setCommandChannelId(data.settings.commandChannelId || '');
                }
            })
            .finally(() => setLoading(false));
    }, [guildId]);

    const saveSettings = async () => {
        if (!guildId) return;
        setSaving(true);
        try {
            await fetch('/api/features/youtube-bot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guildId,
                    enabled: globalEnabled,
                    commandChannelId
                })
            });
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-[#FF0000] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pt-6 space-y-6 pb-20">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <MainToggle enabled={globalEnabled} onChange={setGlobalEnabled} />
                <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                    بوت اليوتيوب
                    <PlaySquare className="w-6 h-6 text-[#FF0000]" />
                </h2>
            </div>

            {globalEnabled && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
                    
                    <div className="bg-[#242529] border border-white/5 rounded-2xl p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-white mb-2 text-right">روم أوامر اليوتيوب</h3>
                            <p className="text-gray-400 text-sm text-right">
                                اختر الروم الكتابي الذي يستمع فيه البوت لروابط اليوتيوب.
                                عند إرسال أي رابط يوتيوب في هذا الروم، سيدخل البوت للروم الصوتي المتواجد فيه المرسل ويقوم بالتشغيل.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex-1 flex items-center gap-3 bg-black/20 border border-white/10 rounded-lg p-3">
                                <Hash className="w-5 h-5 text-gray-400" />
                                <select 
                                    className="w-full bg-transparent text-white outline-none cursor-pointer"
                                    value={commandChannelId}
                                    onChange={(e) => setCommandChannelId(e.target.value)}
                                    dir="rtl"
                                >
                                    <option value="" className="bg-[#1e1f22] text-gray-400">اختر الروم المخصص...</option>
                                    {textChannels.map((c: any) => (
                                        <option key={c.id} value={c.id} className="bg-[#1e1f22] text-white">{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="flex justify-end pt-4">
                        <button 
                            onClick={saveSettings}
                            disabled={saving}
                            className="bg-[#FF0000] hover:bg-[#CC0000] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,0,0,0.5)] flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}
