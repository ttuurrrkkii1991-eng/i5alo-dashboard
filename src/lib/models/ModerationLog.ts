import { Schema, model, models } from 'mongoose';

const ModerationLogSchema = new Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: null },
    moderatorId: { type: String, required: true },
    moderatorName: { type: String, required: true },
    moderatorAvatar: { type: String, default: null },
    action: { type: String, required: true }, // 'Ban', 'Mute', 'Warn', etc.
    reason: { type: String, default: 'لا يوجد سبب محدد' },
    punishmentTime: { type: Date, default: Date.now },
    durationMs: { type: Number, default: null }, // Duration for Mutes/Bans if temporary
}, { timestamps: true });

export const ModerationLog = models.ModerationLog || model('ModerationLog', ModerationLogSchema);
