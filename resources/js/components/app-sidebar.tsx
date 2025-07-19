import { NavUser } from '@/components/nav-user';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function AppSidebar() {
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const { props } = usePage<{ sede?: { nombre: string; direccion: string } }>();

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();

            // Format date in Spanish (e.g., "miércoles, 11 de junio de 2025")
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };
            const formattedDate = now.toLocaleDateString('es-ES', options);

            // Format time as HH:MM
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');

            setCurrentDateTime(formattedDate);
            setCurrentTime(`${hours}:${minutes}`);
        };

        // Update immediately
        updateDateTime();

        // Then update every minute (60000ms = 1 minute)
        const timerId = setInterval(updateDateTime, 60000);

        // Cleanup interval on component unmount
        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="flex h-full w-full items-center justify-between">
            <div className="mr-4 flex items-center gap-4 text-xl font-bold text-white">
                <a href="/dashboard">
                    <img src="/hospital-header-image.png" alt="hospital header image" className="w-15" />
                </a>
                <div className="flex flex-col gap-2">
                    <p>
                        Sede actual: <span className="font-semibold text-white">{props.sede?.nombre ?? 'Ninguna'}</span>
                    </p>
                    <div className="flex flex-col items-center">
                        <p className="rounded-full border border-white bg-[#1F9AFF] px-6 py-1 text-xs text-white">
                            {currentDateTime} - {currentTime}
                        </p>
                    </div>
                </div>
            </div>
            {/* <div className="flex-1"></div> */}
            <div className="flex items-center">
                <NavUser />
            </div>
        </div>
    );
}
