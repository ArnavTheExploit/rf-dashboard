'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';

export default function PageLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-[#0f172a]">
            <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div
                className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'ml-0'
                    }`}
            >
                {children}
            </div>
        </div>
    );
}
