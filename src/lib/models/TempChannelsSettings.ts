import mongoose from 'mongoose';

const TempChannelsSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    enabled: { type: Boolean, default: false },
    creationChannel: { type: String, default: null },
    categoryChannel: { type: String, default: null },
    maxChannelsPerUser: { type: Number, default: 1 },
    deleteTimeSeconds: { type: Number, default: 3 },
    maxUsersPerChannel: { type: Number, default: 0 },
    interfaceChannel: { type: String, default: null },
    interfaceMessageId: { type: String, default: null }
});

export default mongoose.models.TempChannelsSettings || mongoose.model('TempChannelsSettings', TempChannelsSettingsSchema);
