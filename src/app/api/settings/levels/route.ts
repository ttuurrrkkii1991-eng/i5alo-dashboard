import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import LevelSettings from '@/lib/models/LevelSettings';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGODB_URI as string);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const guildId = searchParams.get('guildId');

    if (!guildId) {
        return NextResponse.json({ error: 'Guild ID is required' }, { status: 400 });
    }

    try {
        await connectDB();
        let settings = await LevelSettings.findOne({ guildId });
        
        if (!settings) {
            settings = await LevelSettings.create({ guildId });
        }

        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { logDashboardAction } from '@/lib/logger';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { guildId, enabled, textPoints, imagePoints, cooldown } = body;

        if (!guildId) {
            return NextResponse.json({ error: 'Guild ID is required' }, { status: 400 });
        }

        await connectDB();
        const settings = await LevelSettings.findOneAndUpdate(
            { guildId },
            { enabled, textPoints, imagePoints, cooldown },
            { returnDocument: 'after', upsert: true }
        );

        await logDashboardAction({
            guildId,
            user: session.user,
            action: 'تعديل إعدادات نظام اللفلات'
        });

        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
