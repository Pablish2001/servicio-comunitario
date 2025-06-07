import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children }: PropsWithChildren) {
    return (
        <AppShell variant="header">
            <header className="fixed top-0 right-0 left-0 z-40 h-20 bg-[#0368FE] shadow-md">
                <div className="flex h-full items-center justify-between px-4">
                    <div className="flex w-full items-center">
                        <AppSidebar />
                    </div>
                </div>
            </header>
            <div className="pt-16">
                <AppContent variant="header">{children}</AppContent>
            </div>
        </AppShell>
    );
}
