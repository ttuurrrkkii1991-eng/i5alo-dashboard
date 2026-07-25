import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DashboardLog } from '@/lib/models/DashboardLog';

export const dynamic = 'force-dynamic';

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
        
        // Fetch logs for this guild, sorted by newest first, limit 50
        const logs = await DashboardLog.find({ guildId })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        return NextResponse.json(logs);
    } catch (error: any) {
        console.error('Error fetching dashboard logs:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
