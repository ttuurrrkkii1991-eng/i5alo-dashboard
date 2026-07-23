import mongoose from 'mongoose';

const TranscriptSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    ticketNumber: { type: Number, required: true },
    html: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Transcript || mongoose.model('Transcript', TranscriptSchema);
