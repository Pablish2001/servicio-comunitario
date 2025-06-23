import { router } from '@inertiajs/react';

type PersonalLabelProps = {
    name: string;
    userId: number;
    onRemove?: (userId: number) => void;
};

export default function PersonalLabel({ name, userId, onRemove }: PersonalLabelProps) {
    function handleRemove() {
        if (onRemove && confirm(`¿Quitar a ${name} de la lista?`)) {
            onRemove(userId);
        }
    }

    return (
        <li className="flex items-center gap-2 rounded-md bg-white p-4 shadow-md">
            <img src="/person-icon.png" alt="person icon" />
            <p className="font-bold">{userId}</p>
            <p className="font-bold">{name}</p>
            <button onClick={handleRemove} className="ml-auto font-bold text-red-600 hover:text-red-800" aria-label={`Quitar a ${name}`}>
                X
            </button>
        </li>
    );
}
