"use client";

import React, { useState } from 'react';
import clsx from 'clsx';
import { Palette } from 'lucide-react';

// Toggle switch matching the exact screenshot design
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

const CommandRow = ({ name, description, defaultEnabled = true }) => {
    const [enabled, setEnabled] = useState(defaultEnabled);

    return (
        <div className="bg-[#242529] rounded-xl p-4 flex items-center justify-between hover:bg-[#2a2b2f] transition-colors mb-3">
            <div className="flex items-center gap-4">
                <SubToggle enabled={enabled} onChange={setEnabled} />
                <button className="bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border border-white/5">
                    تعديل
                </button>
            </div>
            <div className="text-left flex flex-col items-end">
                <h3 className="text-white font-bold text-lg mb-1">{name}/</h3>
                <p className="text-gray-400 text-sm text-right" dir="rtl">{description}</p>
            </div>
        </div>
    );
};

const ColorSetCard = ({ title, count, colors, index }) => (
    <div className="bg-[#242529] hover:bg-[#2a2b2f] border border-white/5 rounded-xl p-5 cursor-pointer transition-colors flex flex-col items-end justify-between h-32">
        <div className="text-right">
            <h4 className="text-white font-bold text-md">{title}</h4>
            <p className="text-gray-400 text-xs mt-1">{count} الألوان</p>
        </div>
        <div className="flex items-center gap-[-5px]">
            <span className="bg-gray-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full mr-2">
                {index}
            </span>
            <div className="flex -space-x-2 space-x-reverse">
                {colors.map((color, i) => (
                    <div 
                        key={i} 
                        className="w-5 h-5 rounded-full border-2 border-[#242529]"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </div>
    </div>
);

export default function ColorsPage() {
    const [globalEnabled, setGlobalEnabled] = useState(true);

    return (
        <div className="max-w-5xl mx-auto pt-6 space-y-8">
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <MainToggle enabled={globalEnabled} onChange={setGlobalEnabled} />
                <h2 className="text-2xl font-bold text-white tracking-wide">الألوان</h2>
            </div>

            {globalEnabled && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-8">
                    
                    {/* Settings Form */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-right text-gray-400 text-sm">نص قائمة الألوان</label>
                            <input 
                                type="text" 
                                defaultValue="Color List" 
                                className="bg-[#242529] border border-white/10 rounded-lg p-2.5 text-white text-right outline-none focus:border-indigo-500/50" 
                                dir="ltr"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-right text-gray-400 text-sm">شكل الألوان</label>
                            <select className="bg-[#242529] border border-white/10 rounded-lg p-3 text-white text-right outline-none focus:border-indigo-500/50 appearance-none" dir="rtl">
                                <option>مربعة</option>
                                <option>دائرية</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2 col-span-2">
                            <label className="text-right text-gray-400 text-sm">خلفية قائمة الألوان</label>
                            <select className="bg-[#242529] border border-white/10 rounded-lg p-3 text-white text-right outline-none focus:border-indigo-500/50 appearance-none" dir="rtl">
                                <option>شفافة</option>
                                <option>سوداء</option>
                                <option>بيضاء</option>
                            </select>
                        </div>
                    </div>

                    {/* Commands */}
                    <div>
                        <CommandRow name="color" description="لتغيير لونك بالسيرفر." />
                        <CommandRow name="colors" description="يسرد لك كل الألوان المتاحة." />
                    </div>

                    {/* Color Sets */}
                    <div>
                        <div className="flex justify-end mb-4">
                            <span className="text-gray-500 text-xs font-bold tracking-widest uppercase">COLOR SETS</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <ColorSetCard title="Monochrome" count={11} index={7} colors={['#ffffff', '#e0e0e0', '#bdbdbd', '#757575']} />
                            <ColorSetCard title="Glow Sun" count={20} index={16} colors={['#f39c12', '#f1c40f', '#e67e22', '#d35400']} />
                            <ColorSetCard title="Natural Lake" count={10} index={6} colors={['#2ecc71', '#27ae60', '#1abc9c', '#16a085']} />
                            <ColorSetCard title="Tea Tree" count={10} index={6} colors={['#d7ccc8', '#bcaaa4', '#8d6e63', '#5d4037']} />
                            
                            <ColorSetCard title="Forest Theme" count={17} index={13} colors={['#aed581', '#81c784', '#4db6ac', '#26a69a']} />
                            <ColorSetCard title="Violet Theme" count={10} index={6} colors={['#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2']} />
                            <ColorSetCard title="Red Blood" count={10} index={6} colors={['#e57373', '#f44336', '#d32f2f', '#b71c1c']} />
                            <ColorSetCard title="Atlantic Ocean" count={10} index={6} colors={['#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4']} />
                            
                            <ColorSetCard title="Pinky Candy" count={13} index={1} colors={['#f8bbd0', '#f48fb1', '#f06292', '#e91e63']} />
                            <ColorSetCard title="Safari" count={10} index={1} colors={['#ffcc80', '#ffb74d', '#ffa726', '#ff9800']} />
                            <ColorSetCard title="Imperial" count={10} index={1} colors={['#ffecb3', '#ffe082', '#ffd54f', '#ffca28']} />
                            <div className="border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors h-32">
                                <span className="text-gray-400 text-sm font-bold">+ إنشاء مجموعة</span>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
