import FireChat from '@/components/FireChat/FireChat';
import { useAuth } from '@/components/provider/AuthProvider';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

export default function Home() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    return (
        <div className="w-[100dvw] h-[100dvh] relative">
            <FireChat />
            {user ? (
                <Button
                    className="absolute bottom-4 left-4"
                    onClick={() => {
                        auth.signOut();
                    }}
                >
                    LOG OUT
                </Button>
            ) : (
                <DropdownMenu open={open}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="absolute bottom-4 left-4"
                            onClick={() => setOpen(!open)}
                        >
                            LOG IN
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-48 p-4"
                        side="top"
                        align="start"
                    >
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const email = form.email.value as string;
                                const password = form.password.value as string;
                                signInWithEmailAndPassword(
                                    auth,
                                    email,
                                    password
                                )
                                    .then(() => {
                                        setOpen(false);
                                    })
                                    .catch((error) => {
                                        alert(error.message);
                                    });
                            }}
                        >
                            <Input
                                name="email"
                                type="email"
                                placeholder="Email"
                                className="mb-2"
                            />
                            <Input
                                name="password"
                                type="password"
                                placeholder="Password"
                                className="mb-2"
                            />
                            <Button type="submit">LOG IN</Button>
                        </form>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}
