interface PersonaForLabel {
    nombre: string;
    apellido: string;
}

interface PersonalLabelProps {
    cedula: string;
    persona: PersonaForLabel | null; // Solo lo que necesita PersonalLabel
}

const PersonalLabel: React.FC<PersonalLabelProps> = ({ cedula, persona }) => {
    const displayName = persona ? `${persona.nombre} ${persona.apellido}`.trim() : `(Cédula: ${cedula})`;

    return (
        <li className="flex items-center justify-between rounded-md bg-white p-4 shadow-sm">
            <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-800">{displayName}</span>
                <span className="text-sm text-gray-600">C.I.: {cedula}</span>
            </div>
        </li>
    );
};

export default PersonalLabel;
