"use client";

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Loader2, Image as ImageIcon } from 'lucide-react';

const MainToggle = ({ enabled, onChange }: any) => (
    <div 
        className={clsx(
            "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out shrink-0",
            enabled ? "bg-emerald-400" : "bg-gray-600"
        )}
        onClick={() => onChange(!enabled)}
    >
        <div 
            className={clsx(
                "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out",
                enabled ? "translate-x-[-24px]" : "translate-x-0"
            )}
        />
    </div>
);

const SubToggle = ({ enabled, onChange }: any) => (
    <div 
        className={clsx(
            "w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out shrink-0 flex items-center",
            enabled ? "bg-white" : "bg-gray-500"
        )}
        onClick={() => onChange(!enabled)}
    >
        <div 
            className={clsx(
                "w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ease-in-out",
                enabled ? "bg-gray-800 translate-x-[-20px]" : "bg-white translate-x-0"
            )}
        />
    </div>
);

export default function WelcomePage() {
    const [guildId, setGuildId] = useState<string | null>(null);
    const [channels, setChannels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Settings state
    const [enabled, setEnabled] = useState(false);
    const [welcomeEnabled, setWelcomeEnabled] = useState(false);
    const [welcomeChannel, setWelcomeChannel] = useState('');
    const [welcomeMessage, setWelcomeMessage] = useState('مرحباً بك {user} في السيرفر!');
    const [welcomeImageEnabled, setWelcomeImageEnabled] = useState(false);
    const [welcomeImageBackground, setWelcomeImageBackground] = useState('');
    
    const [leaveEnabled, setLeaveEnabled] = useState(false);
    const [leaveChannel, setLeaveChannel] = useState('');
    const [leaveMessage, setLeaveMessage] = useState('وداعاً {user} 👋');

    useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.textChannels) {
                    setChannels(data.textChannels);
                }
                if (data.guild) {
                    setGuildId(data.guild.id);
                }
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!guildId) return;
        setLoading(true);
        fetch(`/api/settings/welcome?guildId=${guildId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.settings) {
                    setEnabled(data.settings.enabled);
                    setWelcomeEnabled(data.settings.welcomeEnabled);
                    setWelcomeChannel(data.settings.welcomeChannel || '');
                    setWelcomeMessage(data.settings.welcomeMessage || 'مرحباً بك {user} في السيرفر!');
                    setWelcomeImageEnabled(data.settings.welcomeImageEnabled);
                    setWelcomeImageBackground(data.settings.welcomeImageBackground || '');
                    
                    setLeaveEnabled(data.settings.leaveEnabled);
                    setLeaveChannel(data.settings.leaveChannel || '');
                    setLeaveMessage(data.settings.leaveMessage || 'وداعاً {user} 👋');
                }
            })
            .finally(() => setLoading(false));
    }, [guildId]);

    const saveSettings = async (updateData: any) => {
        if (!guildId) return;
        setSaving(true);
        try {
            await fetch('/api/settings/welcome', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guildId, ...updateData })
            });
        } catch (e) {
            console.error(e);
        }
        setSaving(false);
    };

    const handleToggleMain = (val: boolean) => {
        setEnabled(val);
        saveSettings({ enabled: val });
    };

    const updateSetting = (key: string, value: any) => {
        // Optimistic update locally
        switch(key) {
            case 'welcomeEnabled': setWelcomeEnabled(value); break;
            case 'welcomeChannel': setWelcomeChannel(value); break;
            case 'welcomeMessage': setWelcomeMessage(value); break;
            case 'welcomeImageEnabled': setWelcomeImageEnabled(value); break;
            case 'welcomeImageBackground': setWelcomeImageBackground(value); break;
            case 'leaveEnabled': setLeaveEnabled(value); break;
            case 'leaveChannel': setLeaveChannel(value); break;
            case 'leaveMessage': setLeaveMessage(value); break;
        }
        
        // Save to DB
        saveSettings({
            enabled,
            welcomeEnabled, welcomeChannel, welcomeMessage, welcomeImageEnabled, welcomeImageBackground,
            leaveEnabled, leaveChannel, leaveMessage,
            [key]: value
        });
    };

    if (loading && !guildId) return <div className="text-center pt-20 text-white">جاري التحميل...</div>;

    return (
        <div className="max-w-4xl mx-auto pt-6" dir="rtl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide">الترحيب & المغادرة</h2>
                    {saving && <span className="text-xs text-emerald-500 font-bold">(جاري الحفظ...)</span>}
                </div>
                <MainToggle enabled={enabled} onChange={handleToggleMain} />
            </div>

            {enabled && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    
                    {/* Welcome Section */}
                    <div className="bg-[#242529] rounded-xl p-5 border border-white/5">
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                            <h3 className="text-emerald-400 text-lg font-bold">رسالة الترحيب</h3>
                            <SubToggle enabled={welcomeEnabled} onChange={(v: boolean) => updateSetting('welcomeEnabled', v)} />
                        </div>
                        
                        {welcomeEnabled && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2 font-bold">روم الترحيب:</label>
                                    <select 
                                        value={welcomeChannel} 
                                        onChange={e => updateSetting('welcomeChannel', e.target.value)}
                                        className="w-full bg-[#1e1f22] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-indigo-500 transition-colors"
                                    >
                                        <option value="">-- اختر روم الترحيب --</option>
                                        {channels.map(c => <option key={c.id} value={c.id}># {c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2 font-bold">رسالة الترحيب (استخدم {"{user}"} لمنشن العضو):</label>
                                    <textarea 
                                        value={welcomeMessage}
                                        onChange={e => setWelcomeMessage(e.target.value)}
                                        onBlur={e => updateSetting('welcomeMessage', e.target.value)}
                                        className="w-full bg-[#1e1f22] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-indigo-500 transition-colors resize-y min-h-[80px]"
                                    />
                                </div>
                                
                                <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5 text-indigo-400" />
                                            <h4 className="text-gray-300 font-bold">إرسال صورة ترحيبية</h4>
                                        </div>
                                        <SubToggle enabled={welcomeImageEnabled} onChange={(v: boolean) => updateSetting('welcomeImageEnabled', v)} />
                                    </div>
                                    {welcomeImageEnabled && (
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2 font-bold">رابط خلفية الصورة (اختياري - اترك فارغ للخلفية الافتراضية):</label>
                                            <input 
                                                type="text" 
                                                value={welcomeImageBackground}
                                                onChange={e => setWelcomeImageBackground(e.target.value)}
                                                onBlur={e => updateSetting('welcomeImageBackground', e.target.value)}
                                                placeholder="https://example.com/image.png"
                                                className="w-full bg-[#1e1f22] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-indigo-500 transition-colors"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Leave Section */}
                    <div className="bg-[#242529] rounded-xl p-5 border border-white/5">
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                            <h3 className="text-red-400 text-lg font-bold">رسالة المغادرة</h3>
                            <SubToggle enabled={leaveEnabled} onChange={(v: boolean) => updateSetting('leaveEnabled', v)} />
                        </div>
                        
                        {leaveEnabled && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2 font-bold">روم المغادرة:</label>
                                    <select 
                                        value={leaveChannel} 
                                        onChange={e => updateSetting('leaveChannel', e.target.value)}
                                        className="w-full bg-[#1e1f22] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-indigo-500 transition-colors"
                                    >
                                        <option value="">-- اختر روم المغادرة --</option>
                                        {channels.map(c => <option key={c.id} value={c.id}># {c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2 font-bold">رسالة المغادرة (استخدم {"{user}"} لاسم العضو):</label>
                                    <textarea 
                                        value={leaveMessage}
                                        onChange={e => setLeaveMessage(e.target.value)}
                                        onBlur={e => updateSetting('leaveMessage', e.target.value)}
                                        className="w-full bg-[#1e1f22] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-indigo-500 transition-colors resize-y min-h-[80px]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}
