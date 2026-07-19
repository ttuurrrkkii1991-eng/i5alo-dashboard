import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';

export async function GET() {
    try {
        await connectDB();
        return NextResponse.json({ success: true, message: 'Database connected successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}
