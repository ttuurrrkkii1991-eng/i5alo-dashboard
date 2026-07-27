"use client";

import React, { useState, useEffect } from 'react';
import { Radio, Plus, Save, Loader2, Trash2, Hash } from 'lucide-react';
import clsx from 'clsx';

function extractUsername(url: string, platform: string): string {
    try {
        if (platform === 'youtube') {
            const match = url.match(/@([\w.-]+)/);
            return match ? match[1] : url;
        }
        if (platform === 'tiktok') {
            const match = url.match(/@([\w.-]+)/);
            return match ? match[1] : url;
        }
        if (platform === 'kick') {
            const match = url.match(/kick\.com\/([\w.-]+)/);
            return match ? match[1] : url;
        }
        return url;
    } catch {
        return url;
    }
}

const SettingCard = ({title, description, children }: any) => (
    <div className="glass-panel p-6 hover:border-white/10 transition-colors h-full flex flex-col">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        <div className="flex-1">
            {children}
        </div>
    </div>
);

export default function LiveAlertsPage() {
    const [guildId, setGuildId] = useState<string | null>(null);
    const [textChannels, setTextChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Alerts state
    const [alerts, setAlerts] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.textChannels) setTextChannels(data.textChannels);
                if (data.guild) setGuildId(data.guild.id);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if (!guildId) return;
        setLoading(true);
        fetch(`/api/settings/live-alerts?guildId=${guildId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.settings) {
                    if (data.settings.alerts) {
                        setAlerts(data.settings.alerts.map((a: any) => ({...a, id: a._id || Date.now() + Math.random()})));
                    }
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [guildId]);

    const saveSettings = async () => {
        if (!guildId) return;
        setSaving(true);
        try {
            const res = await fetch('/api/settings/live-alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guildId,
                    alerts: alerts.map(a => ({
                        platform: a.platform,
                        channelUrl: a.channelUrl,
                        username: extractUsername(a.channelUrl, a.platform) || a.username,
                        discordChannelId: a.discordChannelId,
                        customMessage: a.customMessage
                    }))
                })
            });
            const data = await res.json();
            if (data.success) {
                alert('تم حفظ الإعدادات بنجاح! 🚀');
            } else {
                alert('حدث خطأ: ' + data.error);
            }
        } catch (error: any) {
            console.error(error);
            alert('حدث خطأ أثناء الحفظ.');
        }
        setSaving(false);
    };

    const addAlert = () => {
        setAlerts([
            ...alerts, 
            { 
                id: Date.now(), 
                platform: "youtube", 
                channelUrl: "", 
                username: "", 
                discordChannelId: "", 
                customMessage: "البث بدأ!" 
            }
        ]);
    };

    const removeAlert = (id: any) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    const updateAlert = (id: any, field: string, value: any) => {
        setAlerts(alerts.map(a => 
            a.id === id ? { ...a, [field]: value } : a
        ));
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pt-6 pb-20" dir="rtl">
            
            {/* Header */}
            <div className="glass-panel p-8 bg-gradient-to-br from-[#00F2EA]/10 to-transparent border-[#00F2EA]/20 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#00F2EA] mb-2 flex items-center gap-2">
                        <Radio className="w-6 h-6" />
                        إشعارات البث المباشر
                    </h2>
                    <p className="text-gray-300 max-w-2xl text-sm">
                        قم بإعداد إشعارات تلقائية عندما يبدأ بث جديد على يوتيوب، تيك توك، أو كيك ليتم إرسالها إلى سيرفرك.
                    </p>
                </div>
            </div>

            {/* Alerts List */}
            <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                    <button 
                        onClick={addAlert}
                        className="bg-[#00F2EA] hover:bg-[#00D4CD] text-black px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        إضافة إشعار
                    </button>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">الإشعارات الحالية</h3>
                        <p className="text-gray-400 text-sm">قم بإدارة القنوات التي تود التنبيه عند بدء بثها.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {alerts.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 bg-white/5 rounded-xl border border-white/5">
                            لا توجد إشعارات مضافة حالياً.
                        </div>
                    ) : (
                        alerts.map((alert, index) => (
                            <div key={alert.id} className="bg-[#242529] border border-white/5 rounded-xl p-5 flex flex-col lg:flex-row gap-6">
                                
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex gap-4">
                                            <select
                                                value={alert.platform}
                                                onChange={(e) => updateAlert(alert.id, 'platform', e.target.value)}
                                                className={clsx(
                                                    "bg-black/20 border border-white/10 rounded-lg p-2 text-white outline-none font-bold",
                                                    alert.platform === 'youtube' && "text-[#FF0000]",
                                                    alert.platform === 'tiktok' && "text-[#00F2EA]",
                                                    alert.platform === 'kick' && "text-[#53FC18]"
                                                )}
                                                dir="ltr"
                                            >
                                                <option value="youtube">▶️ YouTube</option>
                                                <option value="tiktok">🎵 TikTok</option>
                                                <option value="kick">🟢 Kick</option>
                                            </select>
                                            
                                            <input 
                                                type="text" 
                                                placeholder="رابط القناة (أو اليوزر)"
                                                value={alert.channelUrl}
                                                onChange={(e) => updateAlert(alert.id, 'channelUrl', e.target.value)}
                                                className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-[#00F2EA]/50 text-right"
                                                dir="rtl"
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex-1 flex items-center gap-3 bg-black/20 border border-white/10 rounded-lg p-2">
                                                <Hash className="w-5 h-5 text-gray-400" />
                                                <select 
                                                    className="w-full bg-transparent text-white outline-none cursor-pointer"
                                                    value={alert.discordChannelId}
                                                    onChange={(e) => updateAlert(alert.id, 'discordChannelId', e.target.value)}
                                                    dir="rtl"
                                                >
                                                    <option value="" className="bg-[#1e1f22] text-gray-400">اختر روم الإرسال...</option>
                                                    {textChannels.map((c: any) => (
                                                        <option key={c.id} value={c.id} className="bg-[#1e1f22] text-white">{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <input 
                                                type="text" 
                                                placeholder="رسالة الإشعار المخصصة (اختياري)"
                                                value={alert.customMessage}
                                                onChange={(e) => updateAlert(alert.id, 'customMessage', e.target.value)}
                                                className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-[#00F2EA]/50 text-right"
                                                dir="rtl"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <div className="flex items-center justify-end">
                                    <button 
                                        onClick={() => removeAlert(alert.id)}
                                        className="text-gray-500 hover:text-red-500 transition-colors p-3 bg-white/5 rounded-lg hover:bg-red-500/10"
                                        title="حذف الإشعار"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Action */}
            <div className="flex justify-end pt-4">
                <button 
                    onClick={saveSettings}
                    disabled={saving}
                    className="bg-[#00F2EA] hover:bg-[#00D4CD] text-black px-8 py-3 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(0,242,234,0.3)] hover:shadow-[0_0_25px_rgba(0,242,234,0.5)] flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
            </div>

        </div>
    );
}
