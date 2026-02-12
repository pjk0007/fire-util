import { FireUser, USER_NAME_FIELD, USER_AVATAR_FIELD, USER_AVATAR_FALLBACK_URL } from "@/lib/FireAuth/settings";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { FIRE_CHAT_LOCALE } from "@/components/FireChat/settings";
import Image from "next/image";

interface ChatMentionDropdownProps<U extends FireUser> {
    participants: U[];
    selectedIndex: number;
    onSelect: (user: U) => void;
    position: { top: number; left: number };
}

export default function ChatMentionDropdown<U extends FireUser>({
    participants,
    selectedIndex,
    onSelect,
    position,
}: ChatMentionDropdownProps<U>) {
    if (participants.length === 0) return null;

    return (
        <div
            className="absolute z-50"
            style={{
                bottom: `calc(100% - ${position.top}px + 4px)`,
                left: `${Math.min(position.left, 200)}px`,
            }}
        >
            <Command className="border shadow-lg bg-popover rounded-md w-60">
                <CommandList className="max-h-48">
                    <CommandEmpty className="text-muted-foreground text-center py-2 text-sm">
                        {FIRE_CHAT_LOCALE.FOOTER.MENTION_NO_RESULTS}
                    </CommandEmpty>
                    <CommandGroup>
                        {participants.map((user, index) => (
                            <CommandItem
                                key={user.id}
                                className="text-xs font-medium flex items-center gap-2 cursor-pointer"
                                onSelect={() => onSelect(user)}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                }}
                                style={{
                                    backgroundColor: index === selectedIndex ? "var(--color-accent)" : "transparent",
                                }}
                            >
                                <Image
                                    src={user[USER_AVATAR_FIELD] || USER_AVATAR_FALLBACK_URL}
                                    alt={user[USER_NAME_FIELD]}
                                    width={24}
                                    height={24}
                                    className="rounded-full w-6 h-6 object-cover"
                                />
                                <span>{user[USER_NAME_FIELD]}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </div>
    );
}
