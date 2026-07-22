import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import WelcomeSettings from '@/lib/models/WelcomeSettings';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const guildId = searchParams.get('guildId');

        if (!guildId) return NextResponse.json({ success: false, error: 'Missing guildId' }, { status: 400 });

        let settings = await WelcomeSettings.findOne({ guildId });
        if (!settings) {
            settings = await WelcomeSettings.create({ guildId, enabled: false });
        }

        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

import { logDashboardAction } from '@/lib/logger';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();
        const { guildId, ...updateData } = body;

        if (!guildId) return NextResponse.json({ success: false, error: 'Missing guildId' }, { status: 400 });

        const settings = await WelcomeSettings.findOneAndUpdate(
            { guildId },
            updateData,
            { new: true, upsert: true }
        );

        await logDashboardAction({
            guildId,
            user: session.user,
            action: 'تعديل إعدادات الترحيب والمغادرة'
        });

        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
