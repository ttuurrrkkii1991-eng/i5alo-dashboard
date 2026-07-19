import mongoose from 'mongoose';

const ProtectionSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    
    // Anti-Links
    antiLinks: {
        enabled: { type: Boolean, default: false },
        action: { type: String, default: 'delete' }, // delete, mute, kick, ban
        ignoredRoles: { type: [String], default: [] },
        ignoredChannels: { type: [String], default: [] }
    },

    // Anti-Spam
    antiSpam: {
        enabled: { type: Boolean, default: false },
        action: { type: String, default: 'mute' }, // delete, mute, kick, ban
        messageLimit: { type: Number, default: 5 }, // 5 messages
        timeWindow: { type: Number, default: 5 }, // in 5 seconds
        ignoredRoles: { type: [String], default: [] },
        ignoredChannels: { type: [String], default: [] }
    },

    // Bad Words Filter
    badWords: {
        enabled: { type: Boolean, default: false },
        action: { type: String, default: 'delete' }, // delete, mute, kick, ban
        words: { type: [String], default: [] },
        ignoredRoles: { type: [String], default: [] },
        ignoredChannels: { type: [String], default: [] }
    }
});

export default mongoose.models.ProtectionSettings || mongoose.model('ProtectionSettings', ProtectionSettingsSchema);
