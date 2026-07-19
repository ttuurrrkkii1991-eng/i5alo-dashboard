"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
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

export default function AutoReplyPage() {
    const [guildId, setGuildId] = useState<string | null>(null);
    const [globalEnabled, setGlobalEnabled] = useState(false);
    const [replies, setReplies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trigger, setTrigger] = useState('');
    const [response, setResponse] = useState('');

    useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.guild) {
                    setGuildId(data.guild.id);
                }
            });
    }, []);

    useEffect(() => {
        if (!guildId) return;
        setLoading(true);
        fetch(`/api/settings/auto-reply?guildId=${guildId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.settings) {
                    setGlobalEnabled(data.settings.enabled);
                    setReplies(data.settings.replies || []);
                }
            })
            .finally(() => setLoading(false));
    }, [guildId]);

    const saveSettings = async (enabled: boolean, newReplies: any[]) => {
        if (!guildId) return;
        setSaving(true);
        try {
            await fetch('/api/settings/auto-reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guildId, enabled, replies: newReplies })
            });
        } catch (e) {
            console.error(e);
        }
        setSaving(false);
    };

    const handleToggle = (enabled: boolean) => {
        setGlobalEnabled(enabled);
        saveSettings(enabled, replies);
    };

    const handleAdd = () => {
        if (!trigger.trim() || !response.trim()) return;
        const newReplies = [...replies, { trigger, response }];
        setReplies(newReplies);
        saveSettings(globalEnabled, newReplies);
        setTrigger('');
        setResponse('');
        setIsModalOpen(false);
    };

    const handleDelete = (index: number) => {
        const newReplies = replies.filter((_, i) => i !== index);
        setReplies(newReplies);
        saveSettings(globalEnabled, newReplies);
    };

    if (loading) return <div className="text-center pt-20 text-white">جاري التحميل...</div>;

    return (
        <div className="max-w-5xl mx-auto pt-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <MainToggle enabled={globalEnabled} onChange={handleToggle} />
                <h2 className="text-2xl font-bold text-white tracking-wide">الرد التلقائي {saving && <span className="text-xs text-emerald-500 ml-2">(جاري الحفظ...)</span>}</h2>
            </div>

            {globalEnabled && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex justify-end mb-6">
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg flex items-center gap-2"
                        >
                            إضافة رد تلقائي <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="bg-[#242529] rounded-t-xl p-4 flex items-center justify-between text-gray-400 text-sm font-bold border-b border-white/5" dir="rtl">
                        <div className="flex-[2]">الكلمة (Trigger)</div>
                        <div className="flex-[3]">الرد (Response)</div>
                        <div className="w-20 text-center">إجراء</div>
                    </div>

                    <div className="bg-[#2a2b2f] rounded-b-xl border-t-0 border border-white/5 divide-y divide-white/5" dir="rtl">
                        {replies.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">لا توجد ردود تلقائية حالياً. اضغط على "إضافة رد تلقائي" للبدء.</div>
                        ) : (
                            replies.map((reply, index) => (
                                <div key={index} className="p-4 flex items-center justify-between text-gray-300 text-sm hover:bg-white/[0.02] transition-colors">
                                    <div className="flex-[2] font-bold text-indigo-400">{reply.trigger}</div>
                                    <div className="flex-[3] text-gray-400 bg-black/20 p-2 rounded-md">{reply.response}</div>
                                    <div className="w-20 flex justify-center">
                                        <button onClick={() => handleDelete(index)} className="text-red-400 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
                    <div className="bg-[#313338] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-white mb-6">إضافة رد جديد</h3>
                        
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2 font-bold">عند كتابة (الكلمة):</label>
                                <input 
                                    type="text" 
                                    value={trigger}
                                    onChange={e => setTrigger(e.target.value)}
                                    className="w-full bg-[#1e1f22] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="مثال: السلام عليكم"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2 font-bold">يقوم البوت بالرد:</label>
                                <textarea 
                                    value={response}
                                    onChange={e => setResponse(e.target.value)}
                                    className="w-full bg-[#1e1f22] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-indigo-500 transition-colors min-h-[100px] resize-none"
                                    placeholder="مثال: وعليكم السلام ورحمة الله وبركاته 🌹"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-bold"
                            >
                                إلغاء
                            </button>
                            <button 
                                onClick={handleAdd}
                                disabled={!trigger.trim() || !response.trim()}
                                className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                حفظ وإضافة
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
