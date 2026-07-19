import mongoose from 'mongoose';

const LevelSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    enabled: { type: Boolean, default: true },
    textPoints: { type: Number, default: 15 },
    imagePoints: { type: Number, default: 25 },
    cooldown: { type: Number, default: 15 },
});

export default mongoose.models.LevelSettings || mongoose.model('LevelSettings', LevelSettingsSchema);
