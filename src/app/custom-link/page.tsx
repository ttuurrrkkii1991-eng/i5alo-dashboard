"use client";

import React, { useState } from 'react';
import { Link2, Crown, Copy, ExternalLink } from 'lucide-react';

export default function CustomLinkPage() {
    const [vanityUrl, setVanityUrl] = useState('');

    return (
        <div className="max-w-6xl mx-auto pt-6 space-y-8 pb-20">
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <span className="bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        باقة البريميوم
                    </span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
                    الرابط المخصص
                    <Link2 className="w-6 h-6 text-indigo-400" />
                </h2>
            </div>

            {/* Content */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-8">
                
                {/* Info Card */}
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10 text-right">
                        <h3 className="text-lg font-bold text-white mb-2">رابط مخصص لسيرفرك! 🚀</h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl ml-auto">
                            اصنع رابطاً مختصراً وسهل التذكر لسيرفرك ليتمكن الأعضاء من الدخول للوحة التحكم أو دعوة أصدقائهم بسهولة. هذا الخيار متاح فقط لمشتركي باقة البريميوم.
                        </p>
                    </div>
                </div>

                {/* Vanity URL Input */}
                <div className="bg-[#242529] border border-white/5 rounded-2xl p-8 shadow-lg">
                    <label className="block text-gray-300 text-sm font-bold text-right mb-4">اكتب الرابط المخصص الخاص بك</label>
                    
                    <div className="flex items-center flex-row-reverse rounded-xl overflow-hidden border border-white/10 focus-within:border-indigo-500 transition-colors bg-black/20">
                        {/* Domain Prefix */}
                        <div className="px-6 py-4 bg-white/5 text-gray-400 font-medium text-lg border-l border-white/10" dir="ltr">
                            i5alo.com/
                        </div>
                        
                        {/* Input Field */}
                        <input 
                            type="text" 
                            placeholder="my-server" 
                            value={vanityUrl}
                            onChange={(e) => setVanityUrl(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                            className="flex-1 bg-transparent text-white px-4 py-4 text-lg outline-none text-left font-bold"
                            dir="ltr"
                            maxLength={20}
                        />
                    </div>
                    <p className="text-gray-500 text-xs text-right mt-3">
                        يمكنك استخدام الحروف الإنجليزية، الأرقام، وعلامة الناقص (-) فقط. الحد الأقصى 20 حرف.
                    </p>

                    {/* Preview Area */}
                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]">
                                <Copy className="w-4 h-4" />
                                نسخ الرابط
                            </button>
                            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors">
                                <ExternalLink className="w-4 h-4" />
                                تجربة الرابط
                            </button>
                        </div>
                        <div className="text-left" dir="ltr">
                            <span className="text-gray-400 text-sm mr-2">الرابط النهائي:</span>
                            <span className="text-indigo-400 font-bold text-lg">
                                i5alo.com/{vanityUrl || 'my-server'}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
