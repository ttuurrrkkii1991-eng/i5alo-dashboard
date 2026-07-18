import mongoose from 'mongoose';

const GuildSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    
    automod: {
        badWords: { enabled: { type: Boolean, default: true }, action: { type: String, default: 'delete' } },
        links: { enabled: { type: Boolean, default: false }, action: { type: String, default: 'warn' } },
        spam: { enabled: { type: Boolean, default: true }, action: { type: String, default: 'mute' } },
        repeatedChars: { enabled: { type: Boolean, default: false }, action: { type: String, default: 'delete' } },
    },

    antiraid: {
        newAccounts: { enabled: { type: Boolean, default: false }, minDays: { type: Number, default: 7 } },
        massJoin: { enabled: { type: Boolean, default: false }, limit: { type: Number, default: 10 }, timeWindow: { type: Number, default: 60 } },
        massPing: { enabled: { type: Boolean, default: true }, limit: { type: Number, default: 5 } },
    },

    moderation: {
        adminRoles: [{ type: String }],
        defaultMuteDuration: { type: String, default: '1h' },
        commands: {
            mute: { enabled: { type: Boolean, default: true } },
            unmute: { enabled: { type: Boolean, default: true } },
            ban: { enabled: { type: Boolean, default: true } },
            unban: { enabled: { type: Boolean, default: true } },
            timeout: { enabled: { type: Boolean, default: true } },
            clear: { enabled: { type: Boolean, default: true } },
            warn: { enabled: { type: Boolean, default: true } },
        }
    },

    tickets: {
        channelId: { type: String, default: null },
        types: [{
            name: { type: String },
            emoji: { type: String },
            roles: [{ type: String }]
        }]
    }
}, { timestamps: true });

export default mongoose.models.GuildSettings || mongoose.model('GuildSettings', GuildSettingsSchema);
