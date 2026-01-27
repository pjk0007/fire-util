import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { ANNOTATION_COLORS, ANNOTATION_LOCALE } from './settings';
import type { DrawingTool } from './types';
import { cn } from '@/lib/utils';
import {
    Circle,
    Square,
    MousePointer2,
    Type,
    Pencil,
} from 'lucide-react';

interface AnnotationToolbarProps {
    activeTool: DrawingTool | null;
    onToolChange: (tool: DrawingTool | null) => void;
    activeColor: string;
    onColorChange: (color: string) => void;
}

interface ToolConfig {
    id: DrawingTool | 'select';
    label: string;
    shortcut?: string;
    icon: React.ReactNode;
}

const tools: ToolConfig[] = [
    {
        id: 'select',
        label: ANNOTATION_LOCALE.TOOL_SELECT,
        shortcut: 'V',
        icon: <MousePointer2 className="w-4 h-4" />,
    },
    {
        id: 'pencil',
        label: ANNOTATION_LOCALE.TOOL_PENCIL,
        shortcut: 'D',
        icon: <Pencil className="w-4 h-4" />,
    },
    {
        id: 'text',
        label: ANNOTATION_LOCALE.TOOL_TEXT,
        shortcut: 'T',
        icon: <Type className="w-4 h-4" />,
    },
    {
        id: 'rect',
        label: ANNOTATION_LOCALE.TOOL_RECT,
        shortcut: 'R',
        icon: <Square className="w-4 h-4" />,
    },
    {
        id: 'circle',
        label: ANNOTATION_LOCALE.TOOL_CIRCLE,
        shortcut: 'O',
        icon: <Circle className="w-4 h-4" />,
    },
];

/**
 * 그리기 도구 선택 툴바
 */
export default function AnnotationToolbar({
    activeTool,
    onToolChange,
    activeColor,
    onColorChange,
}: AnnotationToolbarProps) {
    return (
        <TooltipProvider delayDuration={300}>
            <div className="flex items-center gap-1 p-1.5 bg-background border rounded-xl shadow-lg">
                {/* 도구 버튼들 */}
                {tools.map((tool) => {
                    const isActive =
                        tool.id === 'select'
                            ? activeTool === null
                            : activeTool === tool.id;

                    return (
                        <Tooltip key={tool.id}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        'h-9 w-9 rounded-lg transition-all',
                                        isActive &&
                                            'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                                    )}
                                    onClick={() =>
                                        onToolChange(
                                            tool.id === 'select'
                                                ? null
                                                : (tool.id as DrawingTool)
                                        )
                                    }
                                >
                                    {tool.icon}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="flex items-center gap-2">
                                <span>{tool.label}</span>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}

                {/* 구분선 */}
                <div className="w-px h-6 bg-border mx-1" />

                {/* 색상 선택 */}
                <Popover>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-lg"
                                >
                                    <div
                                        className="w-5 h-5 rounded-full border-2 border-background shadow-sm ring-1 ring-border"
                                        style={{ backgroundColor: activeColor }}
                                    />
                                </Button>
                            </PopoverTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            {ANNOTATION_LOCALE.COLOR}
                        </TooltipContent>
                    </Tooltip>
                    <PopoverContent className="w-auto p-3" align="center">
                        <div className="grid grid-cols-4 gap-2">
                            {ANNOTATION_COLORS.map((color) => (
                                <button
                                    key={color}
                                    className={cn(
                                        'w-8 h-8 rounded-full transition-all hover:scale-110',
                                        'border border-gray-300',
                                        'ring-2 ring-offset-2 ring-offset-background',
                                        activeColor === color
                                            ? 'ring-foreground'
                                            : 'ring-transparent hover:ring-muted-foreground/50'
                                    )}
                                    style={{ backgroundColor: color }}
                                    onClick={() => onColorChange(color)}
                                />
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </TooltipProvider>
    );
}
