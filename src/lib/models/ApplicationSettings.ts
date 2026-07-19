import mongoose from 'mongoose';

const ApplicationSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    title: { type: String, default: 'تقديم للإدارة' },
    sendChannelId: { type: String, required: false },
    receiveChannelId: { type: String, required: false },
    acceptedRoleId: { type: String, required: false },
    questions: [{ type: String }],
    status: { type: Boolean, default: true }
});

export default mongoose.models.ApplicationSettings || mongoose.model('ApplicationSettings', ApplicationSettingsSchema);
