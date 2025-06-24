import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

export function NavUser() {
    const { auth, jornada } = usePage().props as any;

    return (
        <div className="ml-auto">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        className="h-10 rounded-none border-none bg-transparent px-3 text-black hover:bg-[#3EE9FD] hover:text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    >
                        <UserInfo user={auth.user} />
                        <ChevronsUpDown className="ml-2 size-4 text-white" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="min-w-56 rounded-none border-none bg-[#3EE9FD] p-0 text-black shadow-lg"
                    align="end"
                    sideOffset={8}
                >
                    <UserMenuContent user={auth.user} jornada={jornada} />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
