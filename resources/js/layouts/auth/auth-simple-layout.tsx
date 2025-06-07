import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[url(/public/background.jpeg)] p-6 md:p-10">
            <div className="w-200 max-md:w-100 md:max-xl:w-150">
                <div className="flex w-full flex-col gap-8 rounded-xl bg-white p-10 px-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-40">
                            <img src="/hospital-image.png" alt="hospital image" />
                        </div>
                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium text-[#83d5ff]">{title}</h1>
                            <p className="text-center text-sm text-black">{description}</p>
                        </div>
                    </div>
                    {children}
                    <p className="text-center text-sm text-black">Universidad Nacional Experimental de Guayana</p>
                    <div className="flex items-center justify-center">
                        <img src="/uneg-logo.png" alt="uneg-logo" />
                    </div>
                </div>
            </div>
        </div>
    );
}
