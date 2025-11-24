import React, { useEffect, useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Image,
    FileText,
    LogOut,
    Settings,
    ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Sidebar = () => {
    const [currentPath, setCurrentPath] = useState('');

    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
        { icon: Users, label: 'Users', href: '/admin/users' },
        { icon: Users, label: 'Artists', href: '/admin/artists' },
        { icon: Image, label: 'Works', href: '/admin/works' },
        { icon: FileText, label: 'Services', href: '/admin/services' },
        { icon: FileText, label: 'Content', href: '/admin/content' },
    ];

    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-zinc-800 bg-zinc-950">
            <div className="flex h-20 items-center border-b border-zinc-800 px-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-zinc-950">
                        <span className="font-bold">C</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white">Cuba Tattoo</span>
                </div>
            </div>

            <div className="flex flex-1 flex-col justify-between px-4 py-8">
                <nav className="space-y-2">
                    <div className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Menu
                    </div>
                    {menuItems.map((item) => {
                        const isActive = currentPath.startsWith(item.href);
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive
                                    ? 'bg-white text-zinc-950 shadow-lg shadow-white/5'
                                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={`h-5 w-5 ${isActive ? 'text-zinc-950' : 'text-zinc-500 group-hover:text-white'}`} />
                                    {item.label}
                                </div>
                                {isActive && <ChevronRight className="h-4 w-4 text-zinc-950" />}
                            </a>
                        );
                    })}
                </nav>

                <div className="space-y-4 border-t border-zinc-800 pt-6">
                    <div className="px-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Account
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-red-950/20 hover:text-red-400"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
