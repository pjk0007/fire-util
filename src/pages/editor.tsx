import FireEditor from '@/components/FireEditor/FireEditor';

export default function Editor() {
    return (
        <div className="w-[100dvw] h-[100dvh] p-8">
            <FireEditor
                initialDoc={{
                    blocks: [
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Hello, this is a test document in the FireEditor!',
                                    type: 'text',
                                },
                            ],
                        },
                    ],
                }}
            />
        </div>
    );
}
