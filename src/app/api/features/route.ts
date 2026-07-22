import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongoose';
import FeatureToggles from '@/lib/models/FeatureToggles';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const guildId = searchParams.get('guildId');

        if (!guildId) {
            return NextResponse.json({ error: 'Missing guildId' }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        let toggles = await FeatureToggles.findOne({ guildId });
        
        if (!toggles) {
            toggles = await FeatureToggles.create({ guildId, features: {} });
        }

        return NextResponse.json({ features: Object.fromEntries(toggles.features) });
    } catch (error) {
        console.error('Failed to get feature toggles', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { guildId, featureId, enabled } = await req.json();

        if (!guildId || !featureId || typeof enabled !== 'boolean') {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        await connectDB();
        
        // Update the feature toggle
        await FeatureToggles.updateOne(
            { guildId },
            { $set: { [`features.${featureId}`]: enabled } },
            { upsert: true }
        );

        // Sync with specific models if they exist
        if (featureId === 'levels') {
            const LevelSettings = require('@/lib/models/LevelSettings').default;
            await LevelSettings.updateOne({ guildId }, { enabled }, { upsert: true });
        } else if (featureId === 'autoreply') {
            const AutoReplySettings = mongoose.models.AutoReplySettings || mongoose.model('AutoReplySettings', new mongoose.Schema({ guildId: String, enabled: Boolean }, { strict: false }));
            await AutoReplySettings.updateOne({ guildId }, { enabled }, { upsert: true });
        }

        return NextResponse.json({ success: true, featureId, enabled });
    } catch (error) {
        console.error('Failed to update feature toggle', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
