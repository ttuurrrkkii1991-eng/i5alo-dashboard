import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Transcript from '@/lib/models/Transcript';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    
    try {
        const { id } = await context.params;
        const transcript = await Transcript.findById(id);
        if (!transcript) {
            return new NextResponse('Transcript not found', { status: 404 });
        }

        // Return raw HTML
        return new NextResponse(transcript.html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
        });
    } catch (e) {
        return new NextResponse('Invalid ID or Server Error', { status: 500 });
    }
}
