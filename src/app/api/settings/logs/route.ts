import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '@/lib/mongoose';
import GuildLogs from '@/lib/models/GuildLogs';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const guildId = searchParams.get('guildId');

    if (!guildId) return NextResponse.json({ error: 'Missing guildId' }, { status: 400 });

    try {
        await connectDB();
        
        let logs = await GuildLogs.findOne({ guildId });
        
        if (!logs) {
            logs = new GuildLogs({ guildId, events: {}, globalEnabled: true });
            await logs.save();
        }

        return NextResponse.json(logs);
    } catch (error) {
        console.error("GET Logs Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { guildId, globalEnabled, eventKey, eventData } = body;

        if (!guildId) return NextResponse.json({ error: 'Missing guildId' }, { status: 400 });

        await connectDB();
        
        let logs = await GuildLogs.findOne({ guildId });
        
        if (!logs) {
            logs = new GuildLogs({ guildId, events: {}, globalEnabled: true });
        }

        // Update global toggle if provided
        if (typeof globalEnabled === 'boolean') {
            logs.globalEnabled = globalEnabled;
        }

        // Update specific event if provided
        if (eventKey && eventData) {
            logs.events.set(eventKey, {
                enabled: eventData.enabled !== undefined ? eventData.enabled : (logs.events.get(eventKey)?.enabled || false),
                channelId: eventData.channelId !== undefined ? eventData.channelId : (logs.events.get(eventKey)?.channelId || null),
                color: eventData.color !== undefined ? eventData.color : (logs.events.get(eventKey)?.color || '#000000')
            });
        }

        await logs.save();

        return NextResponse.json(logs);
    } catch (error) {
        console.error("POST Logs Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
