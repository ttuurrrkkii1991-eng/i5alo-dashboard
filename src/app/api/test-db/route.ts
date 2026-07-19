import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import GuildLogs from '@/lib/models/GuildLogs';

export async function GET() {
    try {
        await connectDB();
        
        // Write a test document
        let log = await GuildLogs.findOne({ guildId: 'test-guild' });
        if (!log) {
            log = new GuildLogs({ guildId: 'test-guild', events: {}, globalEnabled: true });
        }
        log.globalEnabled = !log.globalEnabled;
        await log.save();
        
        // Read it back
        const result = await GuildLogs.findOne({ guildId: 'test-guild' });

        return NextResponse.json({ success: true, message: 'Database connected and saved!', data: result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}
