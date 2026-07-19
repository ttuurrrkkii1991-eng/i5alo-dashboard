import mongoose from 'mongoose';

const LogSettingsSchema = new mongoose.Schema({
    enabled: { type: Boolean, default: false },
    channelId: { type: String, default: null },
    color: { type: String, default: '#000000' }
}, { _id: false });

const GuildLogsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    globalEnabled: { type: Boolean, default: true },
    events: {
        type: Map,
        of: LogSettingsSchema,
        default: {}
    }
}, { timestamps: true });

export default mongoose.models.GuildLogs || mongoose.model('GuildLogs', GuildLogsSchema);
