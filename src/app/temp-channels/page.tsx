"use client";

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Plus, Minus, Image as ImageIcon } from 'lucide-react';

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
            "w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out shrink-0",
            enabled ? "bg-indigo-500" : "bg-gray-600"
        )}
        onClick={() => onChange(!enabled)}
    >
        <div 
            className={clsx(
                "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out",
                enabled ? "translate-x-[-20px]" : "translate-x-0"
            )}
        />
    </div>
);

const NumberInput = ({ value, label, onChange }: any) => {
    return (
        <div className="flex flex-col items-end gap-2 w-full">
            <label className="text-gray-400 text-xs">{label}</label>
            <div className="flex items-center w-full bg-[#1e1f22] rounded-lg border border-white/5 overflow-hidden">
                <button 
                    className="bg-[#2b2d31] hover:bg-[#313338] text-gray-400 p-2 px-4 transition-colors"
                    onClick={() => onChange(value + 1)}
                >
                    <Plus className="w-4 h-4" />
                </button>
                <input 
                    type="text" 
                    value={value}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) onChange(val);
                    }}
                    className="w-full bg-transparent text-center text-white outline-none"
                />
                <button 
                    className="bg-[#2b2d31] hover:bg-[#313338] text-gray-400 p-2 px-4 transition-colors"
                    onClick={() => onChange(Math.max(0, value - 1))}
                >
                    <Minus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const DiscordButton = ({ label, active = false }: any) => (
    <button className={clsx(
        "px-3 py-2 rounded text-xs font-bold transition-colors w-full",
        active ? "bg-[#5865F2] text-white hover:bg-[#4752C4]" : "bg-[#4e5058] text-gray-200 hover:bg-[#6d6f78]"
    )}>
        {label}
    </button>
);

export default function TempChannelsPage() {
    const [guildId, setGuildId] = useState<string | null>(null);
    const [voiceChannels, setVoiceChannels] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [textChannels, setTextChannels] = useState<any[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Settings
    const [enabled, setEnabled] = useState(false);
    const [creationChannel, setCreationChannel] = useState('');
    const [categoryChannel, setCategoryChannel] = useState('');
    const [maxChannelsPerUser, setMaxChannelsPerUser] = useState(1);
    const [deleteTimeSeconds, setDeleteTimeSeconds] = useState(3);
    const [maxUsersPerChannel, setMaxUsersPerChannel] = useState(0);

    const [cmdEnabled, setCmdEnabled] = useState(true);
    const [embedActive, setEmbedActive] = useState(true);

    useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.voiceChannels) setVoiceChannels(data.voiceChannels);
                if (data.categories) setCategories(data.categories);
                if (data.textChannels) setTextChannels(data.textChannels);
                if (data.guild) setGuildId(data.guild.id);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!guildId) return;
        setLoading(true);
        fetch(`/api/settings/temp-channels?guildId=${guildId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.settings) {
                    setEnabled(data.settings.enabled);
                    setCreationChannel(data.settings.creationChannel || '');
                    setCategoryChannel(data.settings.categoryChannel || '');
                    setMaxChannelsPerUser(data.settings.maxChannelsPerUser || 1);
                    setDeleteTimeSeconds(data.settings.deleteTimeSeconds || 3);
                    setMaxUsersPerChannel(data.settings.maxUsersPerChannel || 0);
                }
            })
            .finally(() => setLoading(false));
    }, [guildId]);

    const saveSettings = async (updateData: any) => {
        if (!guildId) return;
        setSaving(true);
        try {
            await fetch('/api/settings/temp-channels', {
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
        switch(key) {
            case 'creationChannel': setCreationChannel(value); break;
            case 'categoryChannel': setCategoryChannel(value); break;
            case 'maxChannelsPerUser': setMaxChannelsPerUser(value); break;
            case 'deleteTimeSeconds': setDeleteTimeSeconds(value); break;
            case 'maxUsersPerChannel': setMaxUsersPerChannel(value); break;
        }
        
        saveSettings({
            enabled,
            creationChannel, categoryChannel, maxChannelsPerUser, deleteTimeSeconds, maxUsersPerChannel,
            [key]: value
        });
    };

    if (loading && !guildId) return <div className="text-center pt-20 text-white">جاري التحميل...</div>;

    return (
        <div className="max-w-5xl mx-auto pt-6 space-y-6 pb-20" dir="rtl">
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide">الرومات المؤقتة</h2>
                    {saving && <span className="text-xs text-emerald-500 font-bold">(جاري الحفظ...)</span>}
                </div>
                <MainToggle enabled={enabled} onChange={handleToggleMain} />
            </div>

            {enabled && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
                    
                    {/* Basic Settings */}
                    <div className="bg-[#2b2d31] rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-4 border-b border-white/5 text-right font-bold text-white text-sm flex justify-between items-center cursor-pointer hover:bg-white/5">
                            الإعدادات الأساسية
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-6">
                            
                            <div className="flex flex-col items-end gap-2 w-full">
                                <label className="text-gray-400 text-xs flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full border border-gray-500 flex items-center justify-center text-[8px]">!</span>
                                    أنشاء روم
                                </label>
                                <select 
                                    className="w-full bg-[#1e1f22] border border-white/5 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500/50 text-right appearance-none"
                                    value={creationChannel}
                                    onChange={(e) => updateSetting('creationChannel', e.target.value)}
                                    dir="rtl"
                                >
                                    <option value="" className="bg-[#1e1f22] text-white">اختر ..</option>
                                    {voiceChannels.map(vc => <option key={vc.id} value={vc.id} className="bg-[#1e1f22] text-white">🔊 {vc.name}</option>)}
                                </select>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2 w-full">
                                <label className="text-gray-400 text-xs flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full border border-gray-500 flex items-center justify-center text-[8px]">!</span>
                                    كاتجوري
                                </label>
                                <select 
                                    className="w-full bg-[#1e1f22] border border-white/5 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500/50 text-right appearance-none"
                                    value={categoryChannel}
                                    onChange={(e) => updateSetting('categoryChannel', e.target.value)}
                                    dir="rtl"
                                >
                                    <option value="" className="bg-[#1e1f22] text-white">اختر ..</option>
                                    {categories.map(c => <option key={c.id} value={c.id} className="bg-[#1e1f22] text-white">📁 {c.name}</option>)}
                                </select>
                            </div>

                            <NumberInput 
                                value={deleteTimeSeconds} 
                                label="الوقت لحذف الرومات المؤقتة بالثواني" 
                                onChange={(val: number) => updateSetting('deleteTimeSeconds', val)} 
                            />
                            <NumberInput 
                                value={maxChannelsPerUser} 
                                label="الحد الاقصى للرومات التي يمكن للعضو انشائها في نفس الوقت." 
                                onChange={(val: number) => updateSetting('maxChannelsPerUser', val)} 
                            />
                            
                            <NumberInput 
                                value={maxUsersPerChannel} 
                                label="الحد الأقصى لعدد المستخدمين" 
                                onChange={(val: number) => updateSetting('maxUsersPerChannel', val)} 
                            />
                            <div className="col-span-1" />
                        </div>
                    </div>

                    {/* Interface Preview (Visual only for now as requested) */}
                    <div className="bg-[#2b2d31] rounded-xl border border-white/5 overflow-hidden opacity-50 pointer-events-none">
                        <div className="p-4 border-b border-white/5 text-right font-bold text-white text-sm flex flex-col">
                            <span>واجهة التحكم (سيتم برمجتها كخطوة إضافية لاحقاً إذا رغبت)</span>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
