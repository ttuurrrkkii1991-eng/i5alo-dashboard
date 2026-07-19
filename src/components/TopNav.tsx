"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react";

export default function TopNav() {
    const { data: session, status } = useSession();

    return (
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#313338]/80 backdrop-blur-md sticky top-0 z-50">
            {/* Left side (empty or breadcrumbs could go here) */}
            <div>
            </div>
            
            {/* Right side (Actions) */}
            <div className="flex items-center gap-4">
            </div>
        </header>
    );
}
