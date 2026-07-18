"use client";

import React, { useState } from 'react';
import clsx from 'clsx';
import { Plus, Minus, Image as ImageIcon } from 'lucide-react';

const MainToggle = ({ enabled, onChange }) => (
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

const SubToggle = ({ enabled, onChange }) => (
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

const NumberInput = ({ value, label }) => (
    <div className="flex flex-col items-end gap-2 w-full">
        <label className="text-gray-400 text-xs">{label}</label>
        <div className="flex items-center w-full bg-[#1e1f22] rounded-lg border border-white/5 overflow-hidden">
            <button className="bg-[#2b2d31] hover:bg-[#313338] text-gray-400 p-2 px-4 transition-colors">
                <Minus className="w-4 h-4" />
            </button>
            <input 
                type="text" 
                value={value}
                className="w-full bg-transparent text-center text-white outline-none"
                readOnly
            />
            <button className="bg-[#2b2d31] hover:bg-[#313338] text-gray-400 p-2 px-4 transition-colors">
                <Plus className="w-4 h-4" />
            </button>
        </div>
    </div>
);

const DiscordButton = ({ label, active = false }) => (
    <button className={clsx(
        "px-3 py-2 rounded text-xs font-bold transition-colors w-full",
        active ? "bg-[#5865F2] text-white hover:bg-[#4752C4]" : "bg-[#4e5058] text-gray-200 hover:bg-[#6d6f78]"
    )}>
        {label}
    </button>
);

export default function TempChannelsPage() {
    const [globalEnabled, setGlobalEnabled] = useState(true);
    const [cmdEnabled, setCmdEnabled] = useState(true);
    const [embedActive, setEmbedActive] = useState(true);

    return (
        <div className="max-w-5xl mx-auto pt-6 space-y-6 pb-20">
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <MainToggle enabled={globalEnabled} onChange={setGlobalEnabled} />
                <h2 className="text-2xl font-bold text-white tracking-wide">يصنع روم مؤقت.</h2>
            </div>

            {globalEnabled && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
                    
                    {/* Basic Settings */}
                    <div className="bg-[#2b2d31] rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-4 border-b border-white/5 text-right font-bold text-white text-sm flex justify-between items-center cursor-pointer hover:bg-white/5">
                            <span className="text-gray-400 text-xs">▲</span>
                            الإعدادات الأساسية
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-6">
                            
                            <div className="flex flex-col items-end gap-2">
                                <label className="text-gray-400 text-xs flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full border border-gray-500 flex items-center justify-center text-[8px]">!</span>
                                    أنشاء روم
                                </label>
                                <select className="w-full bg-[#1e1f22] border border-white/5 rounded-lg p-2.5 text-white text-right outline-none focus:border-indigo-500/50 appearance-none" dir="rtl">
                                    <option>اختر ..</option>
                                </select>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                                <label className="text-gray-400 text-xs flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full border border-gray-500 flex items-center justify-center text-[8px]">!</span>
                                    كاتجوري
                                </label>
                                <select className="w-full bg-[#1e1f22] border border-white/5 rounded-lg p-2.5 text-white text-right outline-none focus:border-indigo-500/50 appearance-none" dir="rtl">
                                    <option>اختر ..</option>
                                </select>
                            </div>

                            <NumberInput value="1" label="الحد الاقصى للرومات التي يمكن للعضو انشائها في نفس الوقت." />
                            <NumberInput value="3" label="الوقت لحذف الرومات المؤقتة بالثواني" />
                            
                            <div className="col-span-1" />
                            <NumberInput value="." label="الحد الأقصى لعدد المستخدمين" />
                        </div>
                    </div>

                    {/* Command Row */}
                    <div className="bg-[#242529] rounded-xl p-4 flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-4">
                            <SubToggle enabled={cmdEnabled} onChange={setCmdEnabled} />
                            <button className="bg-[#313338] hover:bg-[#3f4147] text-gray-300 px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                                تعديل
                            </button>
                        </div>
                        <div className="text-left flex flex-col items-end">
                            <h3 className="text-white font-bold text-md">temp/</h3>
                            <p className="text-gray-500 text-xs text-right" dir="rtl">يصنع روم مؤقت.</p>
                        </div>
                    </div>

                    {/* Interface Preview */}
                    <div className="bg-[#2b2d31] rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-4 border-b border-white/5 text-right font-bold text-white text-sm">
                            معاينة الواجهة
                        </div>
                        <div className="p-6">
                            
                            {/* Tabs */}
                            <div className="flex justify-end gap-2 mb-4">
                                <button 
                                    className={clsx("px-8 py-1.5 rounded-lg text-sm font-bold transition-colors", !embedActive ? "bg-indigo-500 text-white" : "text-gray-400 hover:bg-white/5")}
                                    onClick={() => setEmbedActive(false)}
                                >
                                    الرسالة
                                </button>
                                <button 
                                    className={clsx("px-8 py-1.5 rounded-lg text-sm font-bold transition-colors", embedActive ? "bg-indigo-500 text-white" : "text-gray-400 hover:bg-white/5")}
                                    onClick={() => setEmbedActive(true)}
                                >
                                    ايمبد
                                </button>
                            </div>

                            {/* Embed Builder UI */}
                            <div className="bg-[#313338] border border-white/5 rounded-xl p-6 relative flex flex-col lg:flex-row gap-6">
                                
                                {/* Left Side: Content Editor */}
                                <div className="flex-1 flex flex-col gap-4">
                                    <div className="flex flex-col gap-2 relative">
                                        <label className="text-gray-400 text-xs text-right absolute right-3 top-[-8px] bg-[#313338] px-1">محتوى الرسالة</label>
                                        <textarea className="w-full h-24 bg-transparent border border-white/10 rounded-lg p-3 text-white outline-none focus:border-indigo-500/50 resize-none" />
                                    </div>
                                    
                                    {/* Embed Box */}
                                    <div className="bg-[#2b2d31] rounded-r-lg border-l-4 border-l-red-500 p-4 shadow-sm flex flex-col gap-3">
                                        
                                        <div className="flex items-center justify-end gap-4 mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-red-500 cursor-pointer"></div>
                                                <div className="w-4 h-4 rounded-full bg-orange-500 cursor-pointer"></div>
                                                <div className="w-4 h-4 rounded-full bg-yellow-500 cursor-pointer"></div>
                                                <div className="w-4 h-4 rounded-full bg-green-500 cursor-pointer"></div>
                                                <div className="w-4 h-4 rounded-full bg-blue-500 cursor-pointer"></div>
                                                <div className="w-4 h-4 rounded-full bg-indigo-500 cursor-pointer"></div>
                                                <div className="w-4 h-4 rounded-full bg-purple-500 cursor-pointer"></div>
                                                <img src="https://i.imgur.com/KzU6kKp.png" alt="color picker" className="w-4 h-4 cursor-pointer" />
                                                <span className="text-gray-400 text-xs mr-2">لون</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <input type="text" placeholder="الإسم" className="bg-transparent border border-white/10 rounded p-1 w-24 text-right text-sm text-white" />
                                                <input type="text" placeholder="رابط" className="bg-transparent border border-white/10 rounded p-1 w-24 text-right text-sm text-white" />
                                            </div>
                                            <div className="w-8 h-8 rounded-full border border-dashed border-gray-600 flex items-center justify-center">
                                                <ImageIcon className="w-4 h-4 text-gray-600" />
                                            </div>
                                        </div>

                                        <input type="text" value="TempVoice Interface" className="bg-transparent border border-white/10 rounded p-2 text-white w-full outline-none" readOnly />
                                        
                                        <textarea 
                                            className="bg-transparent border border-white/10 rounded p-2 text-gray-300 w-full outline-none resize-none h-20 text-sm"
                                            value="This interface can be used to manage temporary voice channels.&#10;More options are available with /voice commands."
                                            readOnly
                                        />

                                        <div>
                                            <button className="bg-indigo-500 text-white text-xs px-4 py-1.5 rounded font-bold">أضف حقل</button>
                                        </div>

                                        <div className="border border-dashed border-gray-600 rounded-lg h-16 flex items-center justify-center mt-2">
                                            <ImageIcon className="w-5 h-5 text-gray-600" />
                                        </div>

                                        <div className="flex items-center gap-2 mt-2">
                                            <input type="text" value="Press the buttons below to use the interface." className="bg-transparent border border-white/10 rounded p-2 text-gray-300 w-full outline-none text-sm" readOnly />
                                            <div className="w-8 h-8 rounded border border-dashed border-gray-600 flex items-center justify-center shrink-0">
                                                <ImageIcon className="w-4 h-4 text-gray-600" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                                {/* Right Side: Thumbnail */}
                                <div className="w-20 h-20 rounded-lg border border-dashed border-gray-600 flex items-center justify-center shrink-0">
                                    <ImageIcon className="w-6 h-6 text-gray-600" />
                                </div>

                            </div>

                            {/* Control Buttons Grid */}
                            <div className="mt-6 flex flex-col items-center">
                                <p className="text-gray-400 text-xs mb-4 text-center w-full max-w-sm ml-auto text-right">اضغط على الأزرار لتبديل الخيارات التي تريدها</p>
                                <div className="grid grid-cols-5 gap-2 w-full max-w-lg ml-auto">
                                    <DiscordButton label="NAME" />
                                    <DiscordButton label="LIMIT" />
                                    <DiscordButton label="PRIVACY" />
                                    <DiscordButton label="CHAT" />
                                    <DiscordButton label="TRUST" />
                                    
                                    <DiscordButton label="UNTRUST" />
                                    <DiscordButton label="KICK" />
                                    <DiscordButton label="REGION" />
                                    <DiscordButton label="BLOCK" />
                                    <DiscordButton label="UNBLOCK" />
                                    
                                    <DiscordButton label="CLAIM" />
                                    <DiscordButton label="TRANSFER" />
                                    <DiscordButton label="DELETE" />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Send Interface Form */}
                    <div className="bg-[#2b2d31] rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-4 border-b border-white/5 text-right font-bold text-white text-sm">
                            إرسال الواجهة
                        </div>
                        <div className="p-6 flex items-center gap-4">
                            <button className="bg-[#313338] hover:bg-[#3f4147] text-white px-8 py-2.5 rounded-lg text-sm font-bold transition-colors">
                                إرسال
                            </button>
                            <select className="w-full bg-[#1e1f22] border border-white/5 rounded-lg p-2.5 text-white text-right outline-none focus:border-indigo-500/50 appearance-none" dir="rtl">
                                <option>اختر روم كتابي</option>
                            </select>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
