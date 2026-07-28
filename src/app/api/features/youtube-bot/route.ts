import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import YoutubeBot from '@/lib/models/YoutubeBot';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const guildId = searchParams.get('guildId');

    if (!guildId) {
        return NextResponse.json({ error: 'Missing guildId' }, { status: 400 });
    }

    try {
        await dbConnect();
        
        let settings = await YoutubeBot.findOne({ guildId });
        
        if (!settings) {
            settings = await YoutubeBot.create({
                guildId,
                enabled: false,
                commandChannelId: null
            });
        }

        return NextResponse.json({ settings });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { guildId, enabled, commandChannelId } = body;

        if (!guildId) {
            return NextResponse.json({ error: 'Missing guildId' }, { status: 400 });
        }

        await dbConnect();
        
        const settings = await YoutubeBot.findOneAndUpdate(
            { guildId },
            { 
                enabled,
                commandChannelId
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, settings });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
