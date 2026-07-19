import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import GuildStats from '@/lib/models/GuildStats'; // Need to create this alias in web/src/lib/models

export async function GET(req: Request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(req.url);
        const guildId = searchParams.get('guildId');
        const days = parseInt(searchParams.get('days') || '7', 10);

        if (!guildId) {
            return NextResponse.json({ success: false, error: 'Missing guildId' }, { status: 400 });
        }

        // Calculate date range
        const today = new Date();
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - days + 1); // +1 to include today
        const pastDateString = pastDate.toISOString().split('T')[0];

        // Fetch stats from DB
        const stats = await GuildStats.find({
            guildId,
            date: { $gte: pastDateString }
        }).sort({ date: 1 }).lean();

        // Fill missing days with 0s to ensure chart has all dates
        const completeStats = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dString = d.toISOString().split('T')[0];
            
            const found = stats.find((s: any) => s.date === dString);
            completeStats.push({
                date: dString,
                messages: found?.messages || 0,
                joins: found?.joins || 0,
                leaves: found?.leaves || 0
            });
        }

        return NextResponse.json({ success: true, stats: completeStats });
    } catch (error: any) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
