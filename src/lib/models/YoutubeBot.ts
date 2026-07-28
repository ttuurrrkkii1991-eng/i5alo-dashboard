import mongoose from 'mongoose';

const youtubeBotSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    enabled: { type: Boolean, default: false },
    commandChannelId: { type: String, default: null }
});

export default mongoose.models.YoutubeBot || mongoose.model('YoutubeBot', youtubeBotSchema);
