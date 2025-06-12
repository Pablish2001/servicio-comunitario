import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';
import PersonalLabel from './personal-label';

type RegisterForm = {
    cedula: string;
    password: string;
    remember: boolean;
};

export default function PersonalRegister() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        cedula: '',
        password: '',
        remember: false,
    });

    return (
        <div className="flex h-100 w-200 flex-col justify-between gap-4 rounded-md bg-[#EDF9FF] p-4 text-black">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <div>
                        <img src="/person-icon-blue.png" alt="person icon blue" className="w-8" />
                    </div>
                    <h2 className="text-xl font-bold text-[#0E469A]">Registro de personal de Salud</h2>
                </div>
                <form action="" className="grid w-full grid-cols-[1fr_1fr_auto] gap-4">
                    <div className="relative">
                        <img src="/search-grey.png" alt="search icon grey" className="absolute translate-x-2 translate-y-1.5" />
                        <Input
                            id="cedula"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="cedula"
                            value={data.cedula}
                            onChange={(e) => setData('cedula', e.target.value)}
                            placeholder="Cedula"
                            className="w-full rounded-md bg-white pl-10 shadow-md"
                        />
                    </div>
                    <div className="relative">
                        <Input placeholder="Contraseña" className="w-full rounded-md bg-white pl-10 shadow-md" />
                        <img src="/password-icon-grey.png" alt="password icon grey" className="absolute top-1.5 left-2" />
                    </div>
                    <Button variant="default" className="h-10 w-10 shrink-0">
                        <span className="text-xl">+</span>
                    </Button>
                </form>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <div className="w-8">
                        <img src="/person-icon-blue.png" alt="person icon blue" />
                    </div>
                    <h2 className="text-xl font-bold text-[#0E469A]">Personal Registrado</h2>
                </div>
                <form action="" className="flex flex-col gap-4">
                    <ul className="flex flex-col gap-4">
                        <PersonalLabel name="JEINDER ABANERO" />
                        <PersonalLabel name="PABLO JIMENEZ" />
                    </ul>
                    <Button variant="default" className="self-center font-bold">
                        INICIAR JORNADA
                    </Button>
                </form>
            </div>
        </div>
    );
}
