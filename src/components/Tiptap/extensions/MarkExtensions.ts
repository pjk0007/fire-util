import { Extensions } from '@tiptap/react';
import Bold from '@tiptap/extension-bold';
import Code from '@tiptap/extension-code';
import Highlight from '@tiptap/extension-highlight';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { TextStyleKit } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';

export default function MarkExtensions(): Extensions {
    return [
        Bold,
        Code,
        Highlight.configure({
            multicolor: true,
        }),
        Italic,
        Link.configure({
            autolink: true,
            defaultProtocol: 'https',
        }),
        Strike,
        Subscript,
        Superscript,
        TextStyleKit,
        Underline,
    ];
}
