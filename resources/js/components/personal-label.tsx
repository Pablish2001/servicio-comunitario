type PersonalLabelProps = {
    name: string;
};

export default function PersonalLabel({ name }: PersonalLabelProps) {
    return (
        <li className="flex items-center gap-2 rounded-md bg-white p-4 shadow-md">
            <img src="/person-icon.png" alt="person icon" />
            <p className="font-bold">{name}</p>
        </li>
    );
}
