import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    typeId: { type: Number, required: true },
    ticketNumber: { type: Number, required: true },
    claimedBy: { type: String, required: false },
    closedAt: { type: Date, required: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
