import React from 'react';
import Sidebar from '../components/admin/Sidebar';
import { Bell, Search } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-white/20">
            <Sidebar />

            <main className="pl-72">
                <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-10 backdrop-blur-xl">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
                        <p className="text-sm text-zinc-400">Manage your studio content</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="h-10 w-64 rounded-full border border-zinc-800 bg-zinc-900/50 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700"
                            />
                        </div>
                        <button className="relative rounded-full p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white">
                            <Bell className="h-5 w-5" />
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-zinc-950"></span>
                        </button>
                        <div className="h-8 w-8 overflow-hidden rounded-full bg-zinc-800 ring-2 ring-zinc-800">
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900 text-xs font-medium text-white">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
