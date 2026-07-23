import mongoose from 'mongoose';

const TicketSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: false },
    categoryId: { type: String, required: false },
    logChannelId: { type: String, required: false, default: null },
    ticketTypes: [{
        id: { type: Number, required: true },
        name: { type: String, required: true },
        emoji: { type: String, required: false },
        roles: [{ type: String }] 
    }],
    counter: { type: Number, default: 0 }
});

export default mongoose.models.TicketSettings || mongoose.model('TicketSettings', TicketSettingsSchema);
