import mongoose from 'mongoose';

const AutoReplySchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    enabled: { type: Boolean, default: false },
    replies: [{
        trigger: { type: String, required: true },
        response: { type: String, required: true }
    }]
});

export default mongoose.models.AutoReply || mongoose.model('AutoReply', AutoReplySchema);
