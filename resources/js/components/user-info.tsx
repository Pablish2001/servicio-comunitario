import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

interface UserInfoProps {
    user: User;
    showEmail?: boolean;
    className?: string;
    textColor?: 'white' | 'black';
}

export function UserInfo({ user, showEmail = false, className = '', textColor = 'white' }: UserInfoProps) {
    const getInitials = useInitials();
    console.log('UserInfo', user);
    // Manejo seguro de nombres
    const fullName = user.persona?.nombre || (user.persona ? `${user.persona.nombre} ${user.persona.apellido}` : 'xd');
    const email = user.persona?.email || '';
    const avatarAlt = fullName || user.persona?.nombre || '';

    // Genera las iniciales como string
    const initials = getInitials(fullName);

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Avatar className="h-7 w-7 overflow-hidden rounded-full border-2 border-white">
                <AvatarImage src={user.avatar} alt={avatarAlt} />
                <AvatarFallback className="bg-white text-black">
                    {initials}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left">
                <span className={`truncate text-sm font-medium ${textColor === 'black' ? 'text-black' : 'text-white'}`}>
                    {fullName}
                </span>
                {showEmail && email && (
                    <span className={`truncate text-xs ${textColor === 'black' ? 'text-black/80' : 'text-white/80'}`}>
                        {email}
                    </span>
                )}
            </div>
        </div>
    );
}
