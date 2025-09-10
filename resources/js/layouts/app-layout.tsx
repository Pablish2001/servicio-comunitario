// resources/js/Layouts/AppLayout.jsx
import { ToastProvider } from '@/components/toast'; // Asegúrate de que la ruta sea correcta
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
}

export default ({ children, ...props }: AppLayoutProps) => (
    <ToastProvider>
        <AppLayoutTemplate {...props}>{children}</AppLayoutTemplate>
    </ToastProvider>
);
