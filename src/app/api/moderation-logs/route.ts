import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ModerationLog } from '@/lib/models/ModerationLog';

export const dynamic = 'force-dynamic';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGODB_URI as string);
}

export async function GET(request: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const guildId = searchParams.get('guildId');

        if (!guildId) {
            return NextResponse.json({ error: 'Guild ID is required' }, { status: 400 });
        }

        await connectDB();
        
        // Fetch logs for this guild, sorted by newest first, limit 100
        const logs = await ModerationLog.find({ guildId })
            .sort({ punishmentTime: -1 })
            .limit(100)
            .lean();

        return NextResponse.json(logs);
    } catch (error: any) {
        console.error('Error fetching moderation logs:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
