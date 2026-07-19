import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import TempChannelsSettings from '@/lib/models/TempChannelsSettings';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const guildId = searchParams.get('guildId');

        if (!guildId) return NextResponse.json({ success: false, error: 'Missing guildId' }, { status: 400 });

        let settings = await TempChannelsSettings.findOne({ guildId });
        if (!settings) {
            settings = await TempChannelsSettings.create({ guildId, enabled: false });
        }

        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { guildId, ...updateData } = body;

        if (!guildId) return NextResponse.json({ success: false, error: 'Missing guildId' }, { status: 400 });

        const settings = await TempChannelsSettings.findOneAndUpdate(
            { guildId },
            updateData,
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
