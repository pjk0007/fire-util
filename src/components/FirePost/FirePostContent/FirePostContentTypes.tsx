import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
    FIRE_POST_LOCALE,
    POST_SHOW_TYPES,
    POST_TYPE_FAQ,
    POST_TYPE_NOTICE,
    POST_TYPES,
    PostShowType,
    PostType,
} from '@/lib/FirePost/settings';

export default function FirePostContentTypes({
    editable,
    type,
    showType,
    setType,
    setShowType,
}: {
    editable: boolean;
    type?: PostType;
    showType?: PostShowType;
    setType: React.Dispatch<React.SetStateAction<PostType | undefined>>;
    setShowType: React.Dispatch<React.SetStateAction<PostShowType | undefined>>;
}) {
    return (
        <div className="flex gap-4 items-center">
            {type ? (
                editable ? (
                    <Select
                        value={type}
                        onValueChange={(value) => setType(value as PostType)}
                    >
                        <SelectTrigger className="w-full">
                            <span>{FIRE_POST_LOCALE.TYPE[type]}</span>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>
                                    {FIRE_POST_LOCALE.TYPE_LABEL}
                                </SelectLabel>
                                {POST_TYPES.map((postType) => (
                                    <SelectItem key={postType} value={postType}>
                                        {FIRE_POST_LOCALE.TYPE[postType]}
                                    </SelectItem>
                                ))}
                                {/* <SelectItem value={POST_TYPE_NOTICE}>공지사항</SelectItem>
                        <SelectItem value={POST_TYPE_FAQ}>FAQ</SelectItem> */}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                ) : (
                    <span className="px-2 py-1 rounded-md bg-muted text-sm">
                        {FIRE_POST_LOCALE.TYPE[type]}
                    </span>
                )
            ) : (
                <Skeleton className="h-7 w-20" />
            )}
            {showType ? (
                editable && (
                    <Select
                        value={showType}
                        onValueChange={(value) =>
                            setShowType(value as PostShowType)
                        }
                    >
                        <SelectTrigger className="w-full">
                            <span>{FIRE_POST_LOCALE.SHOW_TYPE[showType]}</span>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>
                                    {FIRE_POST_LOCALE.SHOW_TYPE_LABEL}
                                </SelectLabel>
                                {POST_SHOW_TYPES.map((postShowType) => (
                                    <SelectItem
                                        key={postShowType}
                                        value={postShowType}
                                    >
                                        {
                                            FIRE_POST_LOCALE.SHOW_TYPE[
                                                postShowType
                                            ]
                                        }
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )
            ) : (
                <Skeleton className="h-7 w-20" />
            )}
        </div>
    );
}
