import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import TicketSettings from '@/lib/models/TicketSettings';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const guildId = searchParams.get('guildId');

        if (!guildId) {
            return NextResponse.json({ success: false, error: 'Guild ID is required' });
        }

        let settings = await TicketSettings.findOne({ guildId });
        
        if (!settings) {
            settings = await TicketSettings.create({
                guildId,
                ticketTypes: [{ id: Date.now(), name: "دعم فني", emoji: "🎫", roles: [] }]
            });
        }

        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}

import { logDashboardAction } from '@/lib/logger';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' });
        }

        await connectDB();
        const body = await req.json();
        const { guildId, channelId, categoryId, logChannelId, ticketTypes } = body;

        if (!guildId) {
            return NextResponse.json({ success: false, error: 'Guild ID is required' });
        }

        const settings = await TicketSettings.findOneAndUpdate(
            { guildId },
            { channelId, categoryId, logChannelId, ticketTypes },
            { returnDocument: 'after', upsert: true }
        );

        await logDashboardAction({
            guildId,
            user: session.user,
            action: 'تعديل إعدادات التذاكر'
        });

        // Notify the bot to send the ticket panel (Send via Discord API)
        try {
            if (channelId && ticketTypes && ticketTypes.length > 0) {
                const token = process.env.DISCORD_TOKEN || process.env.DISCORD_BOT_TOKEN;
                if (token) {
                    let actionRows = [];
                    
                    if (ticketTypes.length === 1) {
                        // Single option -> Send as Button
                        const t = ticketTypes[0];
                        actionRows.push({
                            type: 1, // ActionRow
                            components: [{
                                type: 2, // Button
                                style: 2, // Secondary
                                custom_id: `ticket_open_${t.id}`,
                                label: t.name,
                                emoji: t.emoji ? { name: t.emoji } : undefined
                            }]
                        });
                    } else {
                        // Multiple options -> Send as StringSelectMenu
                        const options = ticketTypes.map((t: any) => ({
                            label: t.name,
                            value: `ticket_open_${t.id}`,
                            emoji: t.emoji ? { name: t.emoji } : undefined,
                            description: "افتح تذكرة من هذا النوع"
                        }));

                        actionRows.push({
                            type: 1, // ActionRow
                            components: [{
                                type: 3, // StringSelectMenu
                                custom_id: `ticket_select`,
                                options: options,
                                placeholder: "اختر نوع التذكرة لفتحها..."
                            }]
                        });
                    }

                    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bot ${token}`
                        },
                        body: JSON.stringify({
                            embeds: [{
                                title: "🎫 نظام التذاكر (Tickets System)",
                                description: "يرجى اختيار القسم المناسب لنوع المشكلة أو الاستفسار الذي لديك من القائمة أدناه وسيتم فتح تذكرة خاصة بك للتواصل مع الإدارة.",
                                color: 0xf1c40f,
                                footer: { text: "تذاكر الدعم الفني" }
                            }],
                            components: actionRows
                        })
                    });
                }
            }
        } catch (e) {
            console.error("Failed to send ticket panel to discord:", e);
        }

        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
