import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0">
                <div className="flex items-center gap-2 px-3 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} textColor="black" />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="m-0 bg-black/20" />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild className="m-0 p-0 text-black hover:bg-[#3EE9FD] focus:bg-[#3EE9FD]">
                    <Link className="flex w-full items-center px-3 py-1.5 text-black hover:text-black focus:text-black" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2 h-4 w-4 text-black" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="m-0 bg-black/20" />
            <DropdownMenuItem asChild className="m-0 p-0 text-black hover:bg-[#3EE9FD] focus:bg-[#3EE9FD]">
                <Link className="flex w-full items-center px-3 py-1.5 text-black hover:text-black focus:text-black" method="post" href={route('logout')} as="button" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4 text-black" />
                    <span>Log out</span>
                </Link>
            </DropdownMenuItem>
        </>
    );
}
