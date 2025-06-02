import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

interface UserInfoProps {
    user: User;
    showEmail?: boolean;
    className?: string;
}

export function UserInfo({ user, showEmail = false, className = '' }: UserInfoProps) {
    const getInitials = useInitials();
    console.log('UserInfo', user);
    // Manejo seguro de nombres
    const fullName = user.persona?.nombre || (user.persona ? `${user.persona.nombre} ${user.persona.apellido}` : 'xd');
    const email = user.persona?.email || '';
    const avatarAlt = fullName || user.persona?.nombre || '';

    // Genera las iniciales como string
    const initials = getInitials(fullName);

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={avatarAlt} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{fullName}</span>
                {showEmail && email && <span className="text-muted-foreground truncate text-xs">{email}</span>}
            </div>
        </div>
    );
}
