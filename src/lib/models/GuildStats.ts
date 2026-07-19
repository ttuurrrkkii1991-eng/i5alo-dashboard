import mongoose from 'mongoose';

const GuildStatsSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    messages: { type: Number, default: 0 },
    joins: { type: Number, default: 0 },
    leaves: { type: Number, default: 0 },
});

GuildStatsSchema.index({ guildId: 1, date: 1 }, { unique: true });

export default mongoose.models.GuildStats || mongoose.model('GuildStats', GuildStatsSchema);
