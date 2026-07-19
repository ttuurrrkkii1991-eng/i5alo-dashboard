import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import ApplicationSettings from '@/lib/models/ApplicationSettings';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const guildId = searchParams.get('guildId');

        if (!guildId) {
            return NextResponse.json({ success: false, error: 'Guild ID is required' });
        }

        let settings = await ApplicationSettings.findOne({ guildId });
        
        if (!settings) {
            settings = await ApplicationSettings.create({
                guildId,
                title: "تقديم للإدارة",
                questions: ["ما هو اسمك؟", "كم عمرك؟", "لماذا تريد الانضمام للإدارة؟"]
            });
        }

        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { guildId, title, sendChannelId, receiveChannelId, acceptedRoleId, questions, status } = body;

        if (!guildId) {
            return NextResponse.json({ success: false, error: 'Guild ID is required' });
        }

        const settings = await ApplicationSettings.findOneAndUpdate(
            { guildId },
            { title, sendChannelId, receiveChannelId, acceptedRoleId, questions, status },
            { new: true, upsert: true }
        );

        // Notify the bot to send the applications panel via Discord API
        try {
            if (sendChannelId && status) {
                const token = process.env.DISCORD_TOKEN || process.env.DISCORD_BOT_TOKEN;
                if (token) {
                    await fetch(`https://discord.com/api/v10/channels/${sendChannelId}/messages`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bot ${token}`
                        },
                        body: JSON.stringify({
                            embeds: [{
                                title: title || "تقديم للإدارة",
                                description: "اضغط على الزر بالأسفل للبدء في تعبئة نموذج التقديم.",
                                color: 0x3498db,
                                footer: { text: "نظام التقديمات" }
                            }],
                            components: [{
                                type: 1, // ActionRow
                                components: [{
                                    type: 2, // Button
                                    style: 1, // Primary (Blue)
                                    custom_id: `app_open`,
                                    label: "تقديم الآن",
                                    emoji: { name: "📝" }
                                }]
                            }]
                        })
                    });
                }
            }
        } catch (e) {
            console.error("Failed to send applications panel to discord:", e);
        }

        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
