import mongoose from 'mongoose';
import { DashboardLog } from './models/DashboardLog';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGODB_URI as string);
}

interface LogOptions {
    guildId: string;
    user: {
        id?: string;
        name?: string;
        image?: string;
    };
    action: string;
}

export async function logDashboardAction({ guildId, user, action }: LogOptions) {
    try {
        await connectDB();
        
        await DashboardLog.create({
            guildId,
            userId: user?.id || 'unknown',
            userName: user?.name || 'مستخدم غير معروف',
            userAvatar: user?.image || null,
            action,
        });
    } catch (error) {
        console.error('Error logging dashboard action:', error);
    }
}
