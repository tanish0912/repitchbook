'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Extension } from '@tiptap/core';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { useEffect } from 'react';
import { usePitchStore } from '@/store/usePitchStore';
import { SlideElement } from '@/types';

interface RichTextEditorProps {
    content: string;
    elementId: string;
    slideId: string;
    initialEditable?: boolean; // If true, autofocus
}

// Define a simple FontSize extension relying on TextStyle
const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
        return {
            types: ['textStyle'],
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize.replace('px', ''),
                        renderHTML: attributes => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}px`,
                            };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setFontSize: (fontSize) => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontSize })
                    .run();
            },
            unsetFontSize: () => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontSize: null })
                    .removeEmptyTextStyle()
                    .run();
            },
        };
    },
});

export const RichTextEditor = ({ content, elementId, slideId, initialEditable }: RichTextEditorProps) => {
    const updateElement = usePitchStore(state => state.updateElement);
    const selectedElementId = usePitchStore(state => state.selectedElementId);

    const isSelected = selectedElementId === elementId;

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Highlight,
            Placeholder.configure({ placeholder: 'Type something...' }),
            TextStyle,
            FontFamily,
            Color,
            FontSize,
        ],
        content: content,
        immediatelyRender: false, // Fix SSR hydration mismatch
        editable: true, // We will control interaction via the wrapper mostly
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            // Debounce active update? For now direct.
            updateElement(slideId, elementId, { html });
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm md:prose-base !max-w-none focus:outline-none h-full text-gray-900 leading-normal',
            },
        },
    });

    // Sync external content changes if needed (e.g. undo/redo)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // Check if active to avoid cursor jumps?
            // Simple check: content length diff?
            // For now, assume local state is source of truth while editing.
        }
    }, [content, editor]);

    const setActiveEditor = usePitchStore(state => state.setActiveEditor);

    useEffect(() => {
        if (isSelected && editor) {
            setActiveEditor(editor);
        }
    }, [isSelected, editor, setActiveEditor]);

    if (!editor) return null;

    return (
        <div className="w-full h-full p-4 cursor-text">
            <EditorContent editor={editor} />
        </div>
    );
};
