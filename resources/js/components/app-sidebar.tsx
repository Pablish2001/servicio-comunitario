import { NavUser } from '@/components/nav-user';

export function AppSidebar() {
    return (
        <div className="items-cente flex h-full w-full justify-between">
            <div className="mr-4 flex items-center gap-4 text-xl font-bold text-white">
                <img src="/hospital-header-image.png" alt="hospital header image" className="w-15" />
                <div className="flex flex-col gap-2">
                    <p>JORNADA LABORAL</p>
                    <p className="rounded-full border border-white bg-[#1F9AFF] px-6 py-1 text-xs text-white">Sábado 29 de Marzo 2025 - 19:47</p>
                </div>
            </div>
            {/* <div className="flex-1"></div> */}
            <div className="flex items-center">
                <NavUser />
            </div>
        </div>
    );
}
