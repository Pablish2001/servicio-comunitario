import PersonalRegister from '@/components/personal-register';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
                <PersonalRegister />
            </div>
        </AppLayout>
    );
}
