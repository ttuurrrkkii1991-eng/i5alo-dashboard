import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import LiveAlertSettings from '@/lib/models/LiveAlertSettings';
import { logDashboardAction } from '@/lib/logger';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();
        const { searchParams } = new URL(req.url);
        const guildId = searchParams.get('guildId');

        if (!guildId) {
            return NextResponse.json({ success: false, error: 'Guild ID is required' });
        }

        let settings = await LiveAlertSettings.findOne({ guildId });
        
        if (!settings) {
            settings = await LiveAlertSettings.create({
                guildId,
                alerts: []
            });
        }

        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' });
        }

        await connectDB();
        const body = await req.json();
        const { guildId, alerts } = body;

        if (!guildId) {
            return NextResponse.json({ success: false, error: 'Guild ID is required' });
        }

        const settings = await LiveAlertSettings.findOneAndUpdate(
            { guildId },
            { alerts },
            { returnDocument: 'after', upsert: true }
        );

        await logDashboardAction({
            guildId,
            user: session.user,
            action: 'تعديل إعدادات إشعارات البث'
        });

        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
