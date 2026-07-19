import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const DISCORD_API = 'https://discord.com/api/v10';
const BOT_TOKEN = process.env.DISCORD_TOKEN;

export async function GET(request: Request) {
    const session: any = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!BOT_TOKEN) {
        return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
    }

    try {
        // Fetch User's Guilds using their OAuth access token
        const userGuildsRes = await fetch(`${DISCORD_API}/users/@me/guilds`, {
            headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        const userGuilds = await userGuildsRes.json();

        // Fetch Bot's Guilds
        const botGuildsRes = await fetch(`${DISCORD_API}/users/@me/guilds`, {
            headers: { Authorization: `Bot ${BOT_TOKEN}` }
        });
        const botGuilds = await botGuildsRes.json();

        if (!Array.isArray(userGuilds) || !Array.isArray(botGuilds)) {
            return NextResponse.json({ error: 'Failed to fetch guilds' }, { status: 500 });
        }

        // Filter: Guilds where user is admin/owner/manage_server AND bot is present
        const botGuildIds = new Set(botGuilds.map((g: any) => g.id));
        
        const validGuilds = userGuilds.filter((g: any) => {
            const perms = BigInt(g.permissions || 0);
            const isAdmin = (perms & 8n) === 8n; // Administrator
            const isManager = (perms & 32n) === 32n; // Manage Server
            return (isAdmin || isManager || g.owner) && botGuildIds.has(g.id);
        });

        if (validGuilds.length === 0) {
            return NextResponse.json({ error: 'No mutual servers found' }, { status: 404 });
        }

        const selectedGuild = validGuilds[0];
        const guildId = selectedGuild.id;

        // Fetch full guild object (to get member count)
        const fullGuildRes = await fetch(`${DISCORD_API}/guilds/${guildId}?with_counts=true`, {
            headers: { Authorization: `Bot ${BOT_TOKEN}` }
        });
        const fullGuild = await fullGuildRes.json();
        
        // Merge full guild data into selectedGuild
        if (fullGuild.approximate_member_count) {
            selectedGuild.memberCount = fullGuild.approximate_member_count;
        }

        // 2. Fetch roles for this guild
        const rolesRes = await fetch(`${DISCORD_API}/guilds/${guildId}/roles`, {
            headers: { Authorization: `Bot ${BOT_TOKEN}` }
        });
        const roles = await rolesRes.json();

        // Filter out @everyone role and sort by position (highest first)
        const formattedRoles = roles
            .filter((r: any) => r.name !== '@everyone')
            .sort((a: any, b: any) => b.position - a.position)
            .map((r: any) => ({
                id: r.id,
                name: r.name,
                color: r.color === 0 ? '#99aab5' : `#${r.color.toString(16).padStart(6, '0')}`
            }));

        // 3. Fetch channels for this guild
        const channelsRes = await fetch(`${DISCORD_API}/guilds/${guildId}/channels`, {
            headers: { Authorization: `Bot ${BOT_TOKEN}` }
        });
        const channels = await channelsRes.json();

        // Filter for category channels (type 4), text channels (type 0), and voice channels (type 2)
        const categories = channels
            .filter((c: any) => c.type === 4)
            .map((c: any) => ({ id: c.id, name: c.name }));
            
        const textChannels = channels
            .filter((c: any) => c.type === 0)
            .map((c: any) => ({ id: c.id, name: c.name }));

        const voiceChannels = channels
            .filter((c: any) => c.type === 2)
            .map((c: any) => ({ id: c.id, name: c.name }));

        return NextResponse.json({
            user: session.user,
            guild: selectedGuild,
            allGuilds: validGuilds,
            roles: formattedRoles,
            categories,
            textChannels,
            voiceChannels,
            debug: { userGuildsCount: userGuilds.length, botGuildsCount: botGuilds.length }
        });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ 
            error: 'Failed to fetch data from Discord', 
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
