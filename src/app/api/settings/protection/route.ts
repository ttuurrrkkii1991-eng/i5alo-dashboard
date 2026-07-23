import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import ProtectionSettings from '@/lib/models/ProtectionSettings';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const guildId = searchParams.get('guildId');

        if (!guildId) return NextResponse.json({ success: false, error: 'Missing guildId' }, { status: 400 });

        let settings = await ProtectionSettings.findOne({ guildId });
        if (!settings) {
            settings = await ProtectionSettings.create({ guildId });
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

        const settings = await ProtectionSettings.findOneAndUpdate(
            { guildId },
            updateData,
            { returnDocument: 'after', upsert: true }
        );

        await logDashboardAction({
            guildId,
            user: session.user,
            action: 'تعديل إعدادات الحماية'
        });

        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
