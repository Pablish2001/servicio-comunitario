import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

type PersonalLabelProps = {
    name: string;
    userId: number;
    onRemove?: (userId: number) => void;
};

export default function PersonalLabel({ name, userId, onRemove }: PersonalLabelProps) {
    const [dialogOpen, setDialogOpen] = useState(false);

    function handleRemoveConfirm() {
        if (onRemove) {
            onRemove(userId);
        }
        setDialogOpen(false);
    }

    return (
        <>
            <li className="flex items-center gap-2 rounded-md bg-white p-4 shadow-md">
                <img src="/person-icon.png" alt="person icon" />
                <p className="font-bold">{userId}</p>
                <p className="font-bold">{name}</p>
                <button
                    type="button"
                    onClick={() => setDialogOpen(true)}
                    className="ml-auto cursor-pointer font-bold text-red-600 hover:text-red-800"
                    aria-label={`Quitar a ${name}`}
                >
                    X
                </button>
            </li>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Quitar a {name} de la lista?</DialogTitle>
                    </DialogHeader>
                    <div className="py-2 text-gray-600">Esta acción quitará al usuario de la lista de personal para la jornada actual.</div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleRemoveConfirm}>
                            Quitar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
