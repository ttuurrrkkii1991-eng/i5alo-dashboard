import mongoose from 'mongoose';

const WelcomeSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    enabled: { type: Boolean, default: false },
    
    // Welcome
    welcomeEnabled: { type: Boolean, default: false },
    welcomeChannel: { type: String, default: null },
    welcomeMessage: { type: String, default: 'مرحباً بك {user} في السيرفر!' },
    welcomeImageEnabled: { type: Boolean, default: false },
    welcomeImageBackground: { type: String, default: null },

    // Leave
    leaveEnabled: { type: Boolean, default: false },
    leaveChannel: { type: String, default: null },
    leaveMessage: { type: String, default: 'وداعاً {user} 👋' }
});

export default mongoose.models.WelcomeSettings || mongoose.model('WelcomeSettings', WelcomeSettingsSchema);
