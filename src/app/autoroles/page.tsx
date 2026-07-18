"use client";

import React, { useState, useEffect } from 'react';
import { Bot, Save, Users, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function AutoRolesPage() {
    const [enabled, setEnabled] = useState(true);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [humanRoles, setHumanRoles] = useState([]);
    const [botRoles, setBotRoles] = useState([]);

    useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.roles) {
                    setRoles(data.roles);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const addHumanRole = (e) => {
        const roleId = e.target.value;
        if (!roleId) return;
        const role = roles.find(r => r.id === roleId);
        if (role && !humanRoles.find(r => r.id === roleId)) {
            setHumanRoles([...humanRoles, role]);
        }
        e.target.value = "";
    };

    const addBotRole = (e) => {
        const roleId = e.target.value;
        if (!roleId) return;
        const role = roles.find(r => r.id === roleId);
        if (role && !botRoles.find(r => r.id === roleId)) {
            setBotRoles([...botRoles, role]);
        }
        e.target.value = "";
    };

    const removeHumanRole = (id) => setHumanRoles(humanRoles.filter(r => r.id !== id));
    const removeBotRole = (id) => setBotRoles(botRoles.filter(r => r.id !== id));

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
                    onClick={() => setEnabled(!enabled)}
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
