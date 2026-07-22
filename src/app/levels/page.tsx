"use client";

import React, { useState } from 'react';
import { Star, MessageSquareText, Image as ImageIcon, Save, Zap } from 'lucide-react';
import clsx from 'clsx';

const SettingCard = ({ icon: Icon, title, description, children }: any) => (
    <div className="glass-panel p-6 hover:border-white/10 transition-colors">
        <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white/5 text-gray-400 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
        {children}
    </div>
);

// Toggle switch matching the exact screenshot design
const MainToggle = ({enabled, onChange }: any) => (
    <div 
        className={clsx(
            "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out shrink-0",
            enabled ? "bg-[#3498db]" : "bg-gray-600"
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

export default function LevelsPage() {
    const [globalEnabled, setGlobalEnabled] = useState(true);
    const [textPoints, setTextPoints] = useState(15);
    const [imagePoints, setImagePoints] = useState(25);
    const [cooldown, setCooldown] = useState(15);
    const [guildId, setGuildId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.guild) {
                    setGuildId(data.guild.id);
                    return fetch(`/api/settings/levels?guildId=${data.guild.id}`);
                }
                throw new Error('No guild');
            })
            .then(res => res.json())
            .then(settings => {
                if (!settings.error) {
                    setGlobalEnabled(settings.enabled ?? true);
                    setTextPoints(settings.textPoints ?? 15);
                    setImagePoints(settings.imagePoints ?? 25);
                    setCooldown(settings.cooldown ?? 15);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        if (!guildId) return;
        setSaving(true);
        try {
            await fetch('/api/settings/levels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guildId,
                    enabled: globalEnabled,
                    textPoints,
                    imagePoints,
                    cooldown
                })
            });
            // Show success (optional: toast notification)
        } catch (error) {
            console.error('Failed to save', error);
        }
        setSaving(false);
    };

    if (loading) return <div className="text-white text-center mt-10">جاري التحميل...</div>;

    return (
        <div className="max-w-5xl mx-auto pt-6 space-y-6">
            
            {/* Page Header matching screenshot style */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <MainToggle enabled={globalEnabled} onChange={setGlobalEnabled} />
                <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                    <Star className="w-6 h-6 text-[#3498db]" />
                    نظام اللفلات (Leveling System)
                </h2>
            </div>

            {globalEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    
                    {/* Text Points Setting */}
                    <SettingCard 
                        icon={MessageSquareText}
                        title="نقاط الرسائل النصية"
                        description="حدد عدد النقاط (XP) التي يحصل عليها العضو عند إرسال أي رسالة نصية عادية في الرومات."
                    >
                        <div className="flex items-center gap-4 bg-black/20 p-4 rounded-lg border border-white/10">
                            <input 
                                type="range" 
                                min="1" 
                                max="100" 
                                value={textPoints}
                                onChange={(e) => setTextPoints(Number(e.target.value))}
                                className="w-full accent-[#3498db]" 
                            />
                            <div className="bg-[#3498db]/20 border border-[#3498db]/30 text-[#3498db] px-4 py-2 rounded-lg font-bold min-w-[80px] text-center">
                                {textPoints} XP
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-right">ملاحظة: البوت يحسب الرسائل التي تزيد عن 3 حروف لتجنب السبام.</p>
                    </SettingCard>

                    {/* Image Points Setting */}
                    <SettingCard 
                        icon={ImageIcon}
                        title="نقاط الصور والوسائط"
                        description="حدد عدد النقاط (XP) التي يحصل عليها العضو عند إرسال صورة أو فيديو في الرومات."
                    >
                        <div className="flex items-center gap-4 bg-black/20 p-4 rounded-lg border border-white/10">
                            <input 
                                type="range" 
                                min="1" 
                                max="100" 
                                value={imagePoints}
                                onChange={(e) => setImagePoints(Number(e.target.value))}
                                className="w-full accent-[#3498db]" 
                            />
                            <div className="bg-[#3498db]/20 border border-[#3498db]/30 text-[#3498db] px-4 py-2 rounded-lg font-bold min-w-[80px] text-center">
                                {imagePoints} XP
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-right">يُفضل وضع نقاط أعلى للصور لتشجيع التفاعل المرئي.</p>
                    </SettingCard>

                    {/* Rate Limit Setting */}
                    <SettingCard 
                        icon={Zap}
                        title="فترة الانتظار (Cooldown)"
                        description="الوقت بالثواني الذي يجب أن ينتظره العضو بين كل رسالة للحصول على نقاط (لمنع السبام)."
                    >
                        <select 
                            value={cooldown}
                            onChange={(e) => setCooldown(Number(e.target.value))}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#3498db]/50 transition-colors"
                        >
                            <option value="15" className="bg-[#1e1f22] text-white">15 ثانية (موصى به)</option>
                            <option value="30" className="bg-[#1e1f22] text-white">30 ثانية</option>
                            <option value="60" className="bg-[#1e1f22] text-white">دقيقة واحدة</option>
                            <option value="0" className="bg-[#1e1f22] text-white">بدون انتظار (غير موصى به)</option>
                        </select>
                    </SettingCard>

                    {/* Action */}
                    <div className="md:col-span-2 flex justify-start p-2">
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-[#3498db] hover:bg-[#2980b9] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(52,152,219,0.3)] hover:shadow-[0_0_25px_rgba(52,152,219,0.5)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}
