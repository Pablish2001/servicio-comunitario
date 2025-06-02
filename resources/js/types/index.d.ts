import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Persona {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    contacto?: string;
    genero: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    cedula: string;
    status: string;
    isAdmind: boolean;
    persona_id: number;
    created_at: string;
    updated_at: string;
    persona: Persona; // Hacerlo opcional y nullable
    avatar?: string;
    nombre_completo?: string;
    email?: string;
}

export interface Auth {
    user: User; // Hacerlo opcional y nullable
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
