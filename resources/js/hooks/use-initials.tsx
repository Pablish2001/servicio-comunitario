// hooks/useInitials.ts
import { useCallback } from 'react';

export function useInitials() {
    return useCallback((name: string): string => {
        if (!name) return '';

        const names = name.trim().split(' ');
        let initials = names[0].charAt(0).toUpperCase();

        if (names.length > 1) {
            initials += names[names.length - 1].charAt(0).toUpperCase();
        }

        return initials;
    }, []);
}
