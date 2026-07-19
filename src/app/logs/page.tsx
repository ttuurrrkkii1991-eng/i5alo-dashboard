"use client";

import React, { useState } from 'react';
import clsx from 'clsx';
import { Crown } from 'lucide-react';

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
            enabled ? "bg-white" : "bg-gray-500"
        )}
        onClick={() => onChange(!enabled)}
    >
        <div 
            className={clsx(
                "w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out",
                enabled ? "bg-gray-800 translate-x-[-20px]" : "bg-white translate-x-0"
            )}
        />
    </div>
);

const LogCard = ({ title, eventKey, channels = [], settings = {}, guildId }: any) => {
    const defaultData = settings[eventKey] || { enabled: false, channelId: '', color: '#000000' };
    
    const [enabled, setEnabled] = useState(defaultData.enabled);
    const [channelId, setChannelId] = useState(defaultData.channelId || '');
    const [color, setColor] = useState(defaultData.color || '#000000');
    
    // Sync state when settings change (e.g. after fetch)
    React.useEffect(() => {
        if (settings[eventKey]) {
            setEnabled(settings[eventKey].enabled);
            setChannelId(settings[eventKey].channelId || '');
            setColor(settings[eventKey].color || '#000000');
        }
    }, [settings, eventKey]);

    const saveSetting = (updates: any) => {
        if (!guildId) return;
        fetch('/api/settings/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                guildId,
                eventKey,
                eventData: { enabled, channelId, color, ...updates }
            })
        }).catch(console.error);
    };

    return (
        <div className="bg-[#242529] hover:bg-[#2a2b2f] border border-white/5 rounded-xl p-5 transition-colors flex flex-col gap-4">
            
            {/* Header */}
            <div className="flex items-start justify-between">
                <SubToggle enabled={enabled} onChange={(val: boolean) => { setEnabled(val); saveSetting({ enabled: val }); }} />
                <div className="flex flex-col items-end">
                    <h3 className="text-white font-medium text-sm text-right">{title}</h3>
                </div>
            </div>

            {/* Channel Select */}
            <div>
                <select 
                    className="w-full bg-[#1e1f22] border border-white/5 rounded-lg p-2.5 text-white text-right text-sm outline-none focus:border-indigo-500/50 appearance-none" 
                    dir="rtl"
                    value={channelId}
                    onChange={(e) => { setChannelId(e.target.value); saveSetting({ channelId: e.target.value }); }}
                >
                    <option value="">اختر الروم ..</option>
                    {channels.map((c: any) => (
                        <option key={c.id} value={c.id}># {c.name}</option>
                    ))}
                </select>
            </div>

            {/* Color Picker */}
            <div className="flex flex-col items-end gap-1">
                <label className="text-gray-400 text-xs">لون</label>
                <div className="w-full h-8 rounded-lg overflow-hidden border border-white/5 relative">
                    <input 
                        type="color" 
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        onBlur={() => saveSetting({ color })}
                        className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] cursor-pointer"
                    />
                </div>
            </div>

        </div>
    );
};

export default function LogsPage() {
    const [globalEnabled, setGlobalEnabled] = useState(true);
    const [channels, setChannels] = useState([]);
    const [guildId, setGuildId] = useState<string | null>(null);
    const [settings, setSettings] = useState<any>({});

    React.useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.textChannels) {
                    setChannels(data.textChannels);
                }
                if (data.guild) {
                    setGuildId(data.guild.id);
                    fetch(`/api/settings/logs?guildId=${data.guild.id}`, { cache: 'no-store' })
                        .then(r => r.json())
                        .then(logData => {
                            if (logData.events) setSettings(logData.events);
                            if (typeof logData.globalEnabled === 'boolean') setGlobalEnabled(logData.globalEnabled);
                        });
                }
            })
            .catch(console.error);
    }, []);

    const saveGlobal = (val: boolean) => {
        setGlobalEnabled(val);
        if (guildId) {
            fetch('/api/settings/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guildId, globalEnabled: val })
            }).catch(console.error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pt-6 space-y-6 pb-20">
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <MainToggle enabled={globalEnabled} onChange={saveGlobal} />
                <h2 className="text-2xl font-bold text-white tracking-wide">اللوق</h2>
            </div>

            {globalEnabled && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* Row 1 */}
                        <LogCard title="إضافة باند" eventKey="guildBanAdd" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="التايم اوت ( إعطاء / أزاله )" eventKey="timeout" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="إنشاء روم جديد" eventKey="channelCreate" channels={channels} settings={settings} guildId={guildId} />

                        {/* Row 2 */}
                        <LogCard title="تم إنشاء ثريد" eventKey="threadCreate" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="إنشاء رتبة" eventKey="roleCreate" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="حذف الروم" eventKey="channelDelete" channels={channels} settings={settings} guildId={guildId} />

                        {/* Row 3 */}
                        <LogCard title="تم حذف الثريد" eventKey="threadDelete" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="حذف رسالة" eventKey="messageDelete" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="حذف رتبة" eventKey="roleDelete" channels={channels} settings={settings} guildId={guildId} />

                        {/* Row 4 */}
                        <LogCard title="تعديل الرسالة" eventKey="messageUpdate" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="طرد العضو" eventKey="memberKick" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="تم نقل العضو إلى روم صوتي آخر" eventKey="voiceMove" channels={channels} settings={settings} guildId={guildId} />

                        {/* Row 5 */}
                        <LogCard title="تم قطع إتصال العضو من الروم الصوتي" eventKey="voiceDisconnect" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="دخول عضو إلى السيرفر" eventKey="guildMemberAdd" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="خروج عضو من السيرفر" eventKey="guildMemberRemove" channels={channels} settings={settings} guildId={guildId} />

                        {/* Row 6 */}
                        <LogCard title="تغيير اسم مستعار" eventKey="memberNicknameUpdate" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="أمر المشرف المستخدم" eventKey="adminCommand" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="إعطاء رتبة" eventKey="roleAdd" channels={channels} settings={settings} guildId={guildId} />

                        {/* Row 7 */}
                        <LogCard title="سحب رتبة" eventKey="roleRemove" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="دعوات السيرفرات" eventKey="inviteCreate" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="فك الباند" eventKey="guildBanRemove" channels={channels} settings={settings} guildId={guildId} />

                        {/* Row 8 */}
                        <LogCard title="تعديل الروم" eventKey="channelUpdate" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="تم تحديث الثريد" eventKey="threadUpdate" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="تعديل صلاحيات الروم" eventKey="channelPermissionsUpdate" channels={channels} settings={settings} guildId={guildId} />

                        {/* Row 9 */}
                        <LogCard title="تعديل رتبة" eventKey="roleUpdate" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="تغيير إعدادات السيرفر" eventKey="guildUpdate" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="دخول عضو لروم صوتي" eventKey="voiceJoin" channels={channels} settings={settings} guildId={guildId} />

                        {/* Row 10 */}
                        <LogCard title="خروج عضو من روم صوتي" eventKey="voiceLeave" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="حالة الصوت (ميوت \ ديفن)" eventKey="voiceMute" channels={channels} settings={settings} guildId={guildId} />
                        <LogCard title="تنقل العضو بين الرومات" eventKey="voiceSwitch" channels={channels} settings={settings} guildId={guildId} />

                    </div>
                </div>
            )}
        </div>
    );
}
