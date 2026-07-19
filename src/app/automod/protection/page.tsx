"use client";

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

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

export default function ProtectionPage() {
    const [guildId, setGuildId] = useState<string | null>(null);
    const [roles, setRoles] = useState<any[]>([]);
    const [textChannels, setTextChannels] = useState<any[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Settings State
    const [antiLinks, setAntiLinks] = useState({ enabled: false, action: 'delete' });
    const [antiSpam, setAntiSpam] = useState({ enabled: false, action: 'mute', messageLimit: 5, timeWindow: 5 });
    const [badWords, setBadWords] = useState({ enabled: false, action: 'delete', words: [] as string[] });
    
    const [badWordsInput, setBadWordsInput] = useState('');

    useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.roles) setRoles(data.roles);
                if (data.textChannels) setTextChannels(data.textChannels);
                if (data.guild) setGuildId(data.guild.id);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!guildId) return;
        setLoading(true);
        fetch(`/api/settings/protection?guildId=${guildId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.settings) {
                    if (data.settings.antiLinks) setAntiLinks(data.settings.antiLinks);
                    if (data.settings.antiSpam) setAntiSpam(data.settings.antiSpam);
                    if (data.settings.badWords) {
                        setBadWords(data.settings.badWords);
                        setBadWordsInput(data.settings.badWords.words?.join(', ') || '');
                    }
                }
            })
            .finally(() => setLoading(false));
    }, [guildId]);

    const saveSettings = async (updateData: any) => {
        if (!guildId) return;
        setSaving(true);
        try {
            await fetch('/api/settings/protection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guildId, ...updateData })
            });
        } catch (e) {
            console.error(e);
        }
        setSaving(false);
    };

    const updateAntiLinks = (key: string, value: any) => {
        const newData = { ...antiLinks, [key]: value };
        setAntiLinks(newData);
        saveSettings({ antiLinks: newData });
    };

    const updateAntiSpam = (key: string, value: any) => {
        const newData = { ...antiSpam, [key]: value };
        setAntiSpam(newData);
        saveSettings({ antiSpam: newData });
    };

    const updateBadWords = (key: string, value: any) => {
        const newData = { ...badWords, [key]: value };
        setBadWords(newData);
        saveSettings({ badWords: newData });
    };

    const handleBadWordsChange = (e: any) => {
        setBadWordsInput(e.target.value);
    };

    const handleBadWordsBlur = () => {
        const wordsArray = badWordsInput.split(',').map(w => w.trim()).filter(w => w.length > 0);
        updateBadWords('words', wordsArray);
    };

    if (loading && !guildId) return <div className="text-center pt-20 text-white">جاري التحميل...</div>;

    return (
        <div className="max-w-5xl mx-auto pt-6 space-y-6 pb-20" dir="rtl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide">نظام الحماية (Protection) 🛡️</h2>
                    {saving && <span className="text-xs text-emerald-500 font-bold">(جاري الحفظ...)</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Anti-Links */}
                <div className="bg-[#2b2d31] rounded-xl border border-white/5 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#242529]">
                        <h3 className="font-bold text-white text-md">منع الروابط (Anti-Links)</h3>
                        <MainToggle enabled={antiLinks.enabled} onChange={(v: boolean) => updateAntiLinks('enabled', v)} />
                    </div>
                    {antiLinks.enabled && (
                        <div className="p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-400 text-xs">الإجراء عند المخالفة</label>
                                <select 
                                    className="w-full bg-[#1e1f22] border border-white/5 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500/50 appearance-none"
                                    value={antiLinks.action}
                                    onChange={(e) => updateAntiLinks('action', e.target.value)}
                                >
                                    <option value="delete">حذف الرسالة فقط</option>
                                    <option value="mute">حذف + ميوت زمني</option>
                                    <option value="kick">حذف + طرد (Kick)</option>
                                    <option value="ban">حذف + حظر (Ban)</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Anti-Spam */}
                <div className="bg-[#2b2d31] rounded-xl border border-white/5 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#242529]">
                        <h3 className="font-bold text-white text-md">منع السبام والتكرار (Anti-Spam)</h3>
                        <MainToggle enabled={antiSpam.enabled} onChange={(v: boolean) => updateAntiSpam('enabled', v)} />
                    </div>
                    {antiSpam.enabled && (
                        <div className="p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-400 text-xs">الإجراء عند المخالفة</label>
                                <select 
                                    className="w-full bg-[#1e1f22] border border-white/5 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500/50 appearance-none"
                                    value={antiSpam.action}
                                    onChange={(e) => updateAntiSpam('action', e.target.value)}
                                >
                                    <option value="delete">حذف الرسائل فقط</option>
                                    <option value="mute">حذف + ميوت زمني</option>
                                    <option value="kick">حذف + طرد (Kick)</option>
                                    <option value="ban">حذف + حظر (Ban)</option>
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col gap-2 w-full">
                                    <label className="text-gray-400 text-xs">عدد الرسائل (الحد الأقصى)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-[#1e1f22] border border-white/5 rounded-lg p-2.5 text-white outline-none text-center"
                                        value={antiSpam.messageLimit}
                                        onChange={(e) => updateAntiSpam('messageLimit', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <label className="text-gray-400 text-xs">المدة الزمنية (بالثواني)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-[#1e1f22] border border-white/5 rounded-lg p-2.5 text-white outline-none text-center"
                                        value={antiSpam.timeWindow}
                                        onChange={(e) => updateAntiSpam('timeWindow', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bad Words */}
                <div className="bg-[#2b2d31] rounded-xl border border-white/5 overflow-hidden flex flex-col md:col-span-2">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#242529]">
                        <h3 className="font-bold text-white text-md">فلتر الكلمات البذيئة (Bad Words Filter)</h3>
                        <MainToggle enabled={badWords.enabled} onChange={(v: boolean) => updateBadWords('enabled', v)} />
                    </div>
                    {badWords.enabled && (
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-400 text-xs">الإجراء عند المخالفة</label>
                                <select 
                                    className="w-full bg-[#1e1f22] border border-white/5 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500/50 appearance-none"
                                    value={badWords.action}
                                    onChange={(e) => updateBadWords('action', e.target.value)}
                                >
                                    <option value="delete">حذف الرسالة فقط</option>
                                    <option value="mute">حذف + ميوت زمني</option>
                                    <option value="kick">حذف + طرد (Kick)</option>
                                    <option value="ban">حذف + حظر (Ban)</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-400 text-xs">الكلمات الممنوعة (افصل بينها بفاصلة ,)</label>
                                <textarea 
                                    className="w-full bg-[#1e1f22] border border-white/5 rounded-lg p-3 text-white outline-none focus:border-indigo-500/50 min-h-[100px] resize-none"
                                    placeholder="كلمة1, كلمة2, كلمة3..."
                                    value={badWordsInput}
                                    onChange={handleBadWordsChange}
                                    onBlur={handleBadWordsBlur}
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
