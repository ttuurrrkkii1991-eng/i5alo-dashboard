"use client";

import React, { useState, useEffect } from 'react';
import { FileClock, Save, Plus, Trash2, Hash, Shield, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const SettingCard = ({ title, description, children }: any) => (
    <div className="glass-panel p-6 hover:border-white/10 transition-colors h-full flex flex-col">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        <div className="flex-1">
            {children}
        </div>
    </div>
);

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

export default function ApplicationsPage() {
    const [guildId, setGuildId] = useState<string | null>(null);
    const [textChannels, setTextChannels] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Settings state
    const [status, setStatus] = useState(true);
    const [title, setTitle] = useState("تقديم للإدارة");
    const [sendChannelId, setSendChannelId] = useState("");
    const [receiveChannelId, setReceiveChannelId] = useState("");
    const [acceptedRoleId, setAcceptedRoleId] = useState("");
    const [questions, setQuestions] = useState<string[]>(["ما هو اسمك؟", "كم عمرك؟", "لماذا تريد الانضمام للإدارة؟"]);

    useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.textChannels) setTextChannels(data.textChannels);
                if (data.roles) setRoles(data.roles);
                if (data.guild) setGuildId(data.guild.id);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!guildId) return;
        setLoading(true);
        fetch(`/api/settings/applications?guildId=${guildId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.settings) {
                    setStatus(data.settings.status);
                    if (data.settings.title) setTitle(data.settings.title);
                    if (data.settings.sendChannelId) setSendChannelId(data.settings.sendChannelId);
                    if (data.settings.receiveChannelId) setReceiveChannelId(data.settings.receiveChannelId);
                    if (data.settings.acceptedRoleId) setAcceptedRoleId(data.settings.acceptedRoleId);
                    if (data.settings.questions && data.settings.questions.length > 0) {
                        setQuestions(data.settings.questions);
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
            await fetch('/api/settings/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guildId,
                    status,
                    title,
                    sendChannelId,
                    receiveChannelId,
                    acceptedRoleId,
                    questions
                })
            });
            alert('تم حفظ الإعدادات بنجاح! وإرسال بانل التقديم للروم (إذا قمت بتحديده). 🚀');
        } catch (error) {
            console.error(error);
            alert('حدث خطأ أثناء الحفظ.');
        }
        setSaving(false);
    };

    const addQuestion = () => {
        if (questions.length < 5) {
            setQuestions([...questions, "سؤال جديد؟"]);
        } else {
            alert('الحد الأقصى للأسئلة هو 5 أسئلة (قيود ديسكورد).');
        }
    };

    const removeQuestion = (index: number) => {
        if (questions.length > 1) {
            const newQuestions = [...questions];
            newQuestions.splice(index, 1);
            setQuestions(newQuestions);
        }
    };

    const updateQuestion = (index: number, val: string) => {
        const newQuestions = [...questions];
        newQuestions[index] = val;
        setQuestions(newQuestions);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pt-6 pb-20" dir="rtl">
            
            {/* Header */}
            <div className="glass-panel p-8 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-blue-400 mb-2 flex items-center gap-2">
                        <FileClock className="w-6 h-6" />
                        نظام التقديمات (Forms)
                    </h2>
                    <p className="text-gray-300 max-w-2xl text-sm">
                        قم بإنشاء نماذج تقديم للإدارة أو لأي هدف آخر، سيقوم البوت بسؤال الأعضاء عبر واجهة (Modal) وإرسال إجاباتهم إلى روم مخصص لك لتقوم بقبولهم أو رفضهم.
                    </p>
                </div>
                <MainToggle enabled={status} onChange={setStatus} />
            </div>

            {status && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Send Channel */}
                        <SettingCard 
                            title="روم إرسال التقديم" 
                            description="الروم الذي ستظهر فيه رسالة البوت وزر التقديم للأعضاء."
                        >
                            <div className="flex items-center gap-3 bg-[#1e1f22] border border-white/10 rounded-lg p-3">
                                <Hash className="w-5 h-5 text-gray-400" />
                                <select 
                                    className="w-full bg-[#1e1f22] text-white outline-none cursor-pointer"
                                    disabled={loading}
                                    value={sendChannelId}
                                    onChange={(e) => setSendChannelId(e.target.value)}
                                    dir="rtl"
                                >
                                    <option value="" className="bg-[#1e1f22] text-white">{loading ? "جاري التحميل..." : "اختر الروم الكتابي..."}</option>
                                    {textChannels.map((c: any) => (
                                        <option key={c.id} value={c.id} className="bg-[#1e1f22] text-white">{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </SettingCard>

                        {/* Receive Channel */}
                        <SettingCard 
                            title="روم استقبال الإجابات (الإدارة)" 
                            description="الروم الذي سيرسل فيه البوت إجابات الأعضاء مع أزرار القبول والرفض."
                        >
                            <div className="flex items-center gap-3 bg-[#1e1f22] border border-white/10 rounded-lg p-3">
                                <Hash className="w-5 h-5 text-gray-400" />
                                <select 
                                    className="w-full bg-[#1e1f22] text-white outline-none cursor-pointer"
                                    disabled={loading}
                                    value={receiveChannelId}
                                    onChange={(e) => setReceiveChannelId(e.target.value)}
                                    dir="rtl"
                                >
                                    <option value="" className="bg-[#1e1f22] text-white">{loading ? "جاري التحميل..." : "اختر روم الإدارة..."}</option>
                                    {textChannels.map((c: any) => (
                                        <option key={c.id} value={c.id} className="bg-[#1e1f22] text-white">{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </SettingCard>

                        {/* Title Input */}
                        <SettingCard 
                            title="عنوان التقديم" 
                            description="العنوان الذي سيظهر في رسالة التقديم وفي أعلى نافذة الأسئلة."
                        >
                            <input 
                                type="text"
                                className="w-full bg-[#1e1f22] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500/50"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="مثال: تقديم للإدارة"
                                dir="rtl"
                            />
                        </SettingCard>

                        {/* Accepted Role */}
                        <SettingCard 
                            title="رتبة القبول" 
                            description="الرتبة التي سيتم إعطاؤها للعضو تلقائياً في حال تم قبوله."
                        >
                            <div className="flex items-center gap-3 bg-[#1e1f22] border border-white/10 rounded-lg p-3">
                                <Shield className="w-5 h-5 text-gray-400" />
                                <select 
                                    className="w-full bg-[#1e1f22] text-white outline-none cursor-pointer"
                                    disabled={loading}
                                    value={acceptedRoleId}
                                    onChange={(e) => setAcceptedRoleId(e.target.value)}
                                    dir="rtl"
                                >
                                    <option value="" className="bg-[#1e1f22] text-white">{loading ? "جاري التحميل..." : "اختر الرتبة..."}</option>
                                    {roles.map((r: any) => (
                                        <option key={r.id} value={r.id} className="bg-[#1e1f22] text-white">{r.name}</option>
                                    ))}
                                </select>
                            </div>
                        </SettingCard>
                    </div>

                    {/* Questions List */}
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                            <button 
                                onClick={addQuestion}
                                disabled={questions.length >= 5}
                                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                إضافة سؤال ({questions.length}/5)
                            </button>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">الأسئلة (الحد الأقصى 5)</h3>
                                <p className="text-gray-400 text-sm">حدد الأسئلة التي يجب على العضو الإجابة عليها.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {questions.map((q, index) => (
                                <div key={index} className="bg-[#1e1f22] border border-white/5 rounded-xl p-4 flex gap-4 items-center">
                                    <button 
                                        onClick={() => removeQuestion(index)}
                                        className="text-gray-500 hover:text-red-500 transition-colors p-2 bg-white/5 rounded-lg hover:bg-red-500/10 shrink-0"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <input 
                                        type="text" 
                                        placeholder={`السؤال رقم ${index + 1}`}
                                        value={q}
                                        onChange={(e) => updateQuestion(index, e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500/50 text-right"
                                        dir="rtl"
                                    />
                                    <span className="text-blue-500 font-bold shrink-0 text-xl w-8 text-center">{index + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action */}
                    <div className="flex justify-end pt-4">
                        <button 
                            onClick={saveSettings}
                            disabled={saving}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {saving ? "جاري الحفظ..." : "حفظ التغييرات وإرسال البانل"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
