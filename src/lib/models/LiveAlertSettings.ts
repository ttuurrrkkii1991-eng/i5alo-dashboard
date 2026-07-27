import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
    platform: { type: String, enum: ['youtube', 'tiktok', 'kick'], required: true },
    channelUrl: { type: String, required: true },
    username: { type: String, required: true },
    discordChannelId: { type: String, required: true },
    customMessage: { type: String, default: '' },
    isLive: { type: Boolean, default: false },
    lastNotifiedAt: { type: Date, default: null }
});

const LiveAlertSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    alerts: [AlertSchema]
});

export default mongoose.models.LiveAlertSettings || mongoose.model('LiveAlertSettings', LiveAlertSettingsSchema);
