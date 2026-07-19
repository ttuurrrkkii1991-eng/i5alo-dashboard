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

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { guildId, enabled, textPoints, imagePoints, cooldown } = body;

        if (!guildId) {
            return NextResponse.json({ error: 'Guild ID is required' }, { status: 400 });
        }

        await connectDB();
        const settings = await LevelSettings.findOneAndUpdate(
            { guildId },
            { enabled, textPoints, imagePoints, cooldown },
            { new: true, upsert: true }
        );

        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
