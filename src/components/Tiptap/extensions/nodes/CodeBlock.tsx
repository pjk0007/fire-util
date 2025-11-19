import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { Node } from '@tiptap/pm/model';

interface CodeBlockNode extends Node {
    attrs: {
        language?: string;
        [key: string]: unknown;
    };
}

interface CodeBlockExtension {
    options: {
        lowlight: {
            listLanguages: () => string[];
        };
        [key: string]: unknown;
    };
}

export default function CodeBlock({
    node,
    updateAttributes,
    extension,
}: {
    node: CodeBlockNode;
    updateAttributes: (attrs: { language: string }) => void;
    extension: CodeBlockExtension;
}) {
    return (
        <NodeViewWrapper className="relative group">
            <div className="absolute px-2 py-1 right-2 top-2  bg-white rounded-lg group-hover:visible invisible">
                <select
                    className="text-sm outline-none hover:bg-accent px-1 py-0.5 rounded-md"
                    contentEditable={false}
                    defaultValue={node.attrs.language || 'null'}
                    onChange={(event) =>
                        updateAttributes({ language: event.target.value })
                    }
                >
                    <option value="null">auto</option>
                    <option disabled>—</option>
                    {extension.options.lowlight
                        .listLanguages()
                        .map((lang: string, index: number) => (
                            <option key={index} value={lang}>
                                {lang}
                            </option>
                        ))}
                </select>
            </div>
            <pre>
                <NodeViewContent as={"code" as "div"} />
            </pre>
        </NodeViewWrapper>
    );
}
