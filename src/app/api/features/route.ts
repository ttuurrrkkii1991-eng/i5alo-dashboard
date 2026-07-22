import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongoose';
import FeatureToggles from '@/lib/models/FeatureToggles';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

import WelcomeSettings from '@/lib/models/WelcomeSettings';
import AutoReply from '@/lib/models/AutoReply';
import LevelSettings from '@/lib/models/LevelSettings';
import AutoRole from '@/lib/models/AutoRole';
import TempChannelsSettings from '@/lib/models/TempChannelsSettings';
import TicketSettings from '@/lib/models/TicketSettings';
import ApplicationSettings from '@/lib/models/ApplicationSettings';
import GuildLogs from '@/lib/models/GuildLogs';
import ProtectionSettings from '@/lib/models/ProtectionSettings';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const guildId = searchParams.get('guildId');

        if (!guildId) return NextResponse.json({ error: 'Missing guildId' }, { status: 400 });

        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();
        
        // Fetch all specific models in parallel
        const [
            welcome, autoreply, levels, autoroles, tempChannels, tickets, applications, logs, protection, togglesDoc
        ] = await Promise.all([
            WelcomeSettings.findOne({ guildId }),
            AutoReply.findOne({ guildId }),
            LevelSettings.findOne({ guildId }),
            AutoRole.findOne({ guildId }),
            TempChannelsSettings.findOne({ guildId }),
            TicketSettings.findOne({ guildId }),
            ApplicationSettings.findOne({ guildId }),
            GuildLogs.findOne({ guildId }),
            ProtectionSettings.findOne({ guildId }),
            FeatureToggles.findOne({ guildId })
        ]);

        const features = {
            'welcome': welcome?.enabled ?? false,
            'autoreply': autoreply?.enabled ?? false,
            'levels': levels?.enabled ?? false,
            'autoroles': autoroles?.enabled ?? false,
            'temp-channels': tempChannels?.enabled ?? false,
            'tickets': tickets?.enabled ?? false,
            'applications': applications?.enabled ?? false,
            'logs': logs?.globalEnabled ?? false,
            'anti-raid': protection?.antiRaidEnabled ?? false,
            'automod': protection?.automodEnabled ?? false,
            'special-protection': protection?.specialProtectionEnabled ?? false,
        };
        
        let toggles = togglesDoc;
        if (!toggles) toggles = await FeatureToggles.create({ guildId, features: {} });

        return NextResponse.json({ 
            features: { ...Object.fromEntries(toggles.features), ...features } 
        }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    } catch (error) {
        console.error('Failed to get feature toggles', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { guildId, featureId, enabled } = await req.json();

        if (!guildId || !featureId || typeof enabled !== 'boolean') {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        await connectDB();
        
        await FeatureToggles.updateOne(
            { guildId },
            { $set: { [`features.${featureId}`]: enabled } },
            { upsert: true }
        );

        if (featureId === 'welcome') await WelcomeSettings.updateOne({ guildId }, { enabled }, { upsert: true });
        else if (featureId === 'autoreply') await AutoReply.updateOne({ guildId }, { enabled }, { upsert: true });
        else if (featureId === 'levels') await LevelSettings.updateOne({ guildId }, { enabled }, { upsert: true });
        else if (featureId === 'autoroles') await AutoRole.updateOne({ guildId }, { enabled }, { upsert: true });
        else if (featureId === 'temp-channels') await TempChannelsSettings.updateOne({ guildId }, { enabled }, { upsert: true });
        else if (featureId === 'tickets') await TicketSettings.updateOne({ guildId }, { enabled }, { upsert: true });
        else if (featureId === 'applications') await ApplicationSettings.updateOne({ guildId }, { enabled }, { upsert: true });
        else if (featureId === 'logs') await GuildLogs.updateOne({ guildId }, { globalEnabled: enabled }, { upsert: true });
        else if (featureId === 'anti-raid') await ProtectionSettings.updateOne({ guildId }, { antiRaidEnabled: enabled }, { upsert: true });
        else if (featureId === 'automod') await ProtectionSettings.updateOne({ guildId }, { automodEnabled: enabled }, { upsert: true });
        else if (featureId === 'special-protection') await ProtectionSettings.updateOne({ guildId }, { specialProtectionEnabled: enabled }, { upsert: true });

        return NextResponse.json({ success: true, featureId, enabled }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    } catch (error) {
        console.error('Failed to update feature toggle', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
