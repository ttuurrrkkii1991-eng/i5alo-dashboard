import mongoose from 'mongoose';

const dashboardLogSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    action: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const DashboardLog = mongoose.models.DashboardLog || mongoose.model('DashboardLog', dashboardLogSchema);
