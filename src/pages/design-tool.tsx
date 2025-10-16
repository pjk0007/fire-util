import FireDesignToolComponents from '@/components/FireDesignTool/FireDesignToolComponents';
import FireDesignToolProperties from '@/components/FireDesignTool/FireDesignToolProperties';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const LEFT_SIDEBAR_WIDTH = 360;
const RIGHT_SIDEBAR_WIDTH = 240;

const TEMP_COMPONENTS = [
    { id: '1', name: 'Button', type: 'button' },
    { id: '2', name: 'Input', type: 'input' },
    { id: '3', name: 'Card', type: 'card' },
];

export default function DesignTool() {
    const [isOpen, setIsOpen] = useState(false);
    const [scale, setScale] = useState(1);
    return (
        <div className="w-[100dvw] h-[100dvh] flex">
            <div className="absolute bottom-0 z-50">
                <Button onClick={() => setIsOpen(!isOpen)}>Toggle</Button>
                <Button
                    onClick={() => {
                        if (scale < 2) setScale(scale + 0.1);
                    }}
                >
                    +
                </Button>
                <Button
                    onClick={() => {
                        if (scale > 0.2) setScale(scale - 0.1);
                    }}
                >
                    -
                </Button>
            </div>
            <FireDesignToolComponents width={isOpen ? LEFT_SIDEBAR_WIDTH : 0} />

            <div
                className="h-full bg-accent overflow-auto"
                style={{
                    width: isOpen
                        ? `calc(100% - ${
                              LEFT_SIDEBAR_WIDTH + RIGHT_SIDEBAR_WIDTH
                          }px)`
                        : '100%',
                }}
            >
                <div
                    className="relative w-full h-full"
                    style={{
                        transform: `scale(${scale})`,
                    }}
                >
                    <span
                        // contentEditable
                        style={{
                            position: 'absolute',
                            top: '700px',
                            left: '700px',
                        }}
                    >
                        123
                    </span>
                    <div
                        // contentEditable
                        style={{
                            position: 'absolute',
                            top: '400px',
                            left: '400px',
                            width: '200px',
                            height: '200px',
                            backgroundColor: 'blue',
                        }}
                    ></div>
                </div>
            </div>
            <FireDesignToolProperties
                width={isOpen ? RIGHT_SIDEBAR_WIDTH : 0}
            />
        </div>
    );
}
