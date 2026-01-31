'use client';

import {
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
    List, Type, Image as LucideImage, Play, ChevronDown, Highlighter
} from 'lucide-react';
import { usePitchStore } from '@/store/usePitchStore';
import { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';

export const GlobalToolbar = () => {
    const selectedElementId = usePitchStore(state => state.selectedElementId);
    const selectedSlideId = usePitchStore(state => state.selectedSlideId);
    const isPreviewMode = usePitchStore(state => state.isPreviewMode);
    const setPreviewMode = usePitchStore(state => state.setPreviewMode);
    const activeEditor = usePitchStore(state => state.activeEditor);

    const addElement = usePitchStore(state => state.addElement);

    const [editor, setEditor] = useState<Editor | undefined>(undefined);
    // Force re-render on editor transaction
    const [_, setUpdateTrigger] = useState(0);

    // Sync editor state
    useEffect(() => {
        setEditor(activeEditor);
        if (activeEditor) {
            const updateHandler = () => setUpdateTrigger(prev => prev + 1);
            activeEditor.on('transaction', updateHandler);
            return () => {
                activeEditor.off('transaction', updateHandler);
            };
        }
    }, [activeEditor]);

    const selectElement = usePitchStore(state => state.selectElement);

    const handleAddText = () => {
        if (!selectedSlideId) return;
        const id = crypto.randomUUID();
        addElement(selectedSlideId, {
            id,
            type: 'text-list',
            x: 100, y: 100, w: 400, h: 200, zIndex: 10,
            html: '<p>Start typing...</p>'
        });
        // Auto-select to focus
        // Small timeout to allow render? Store updates are usually sync but effect propagation might take a tick.
        setTimeout(() => selectElement(id), 0);
    };

    const handleAddImage = () => {
        // Trigger file input click - quick hack or use a hidden input
        document.getElementById('toolbar-image-upload')?.click();
    };

    const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedSlideId || !e.target.files?.[0]) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (ev) => {
            const id = crypto.randomUUID();
            addElement(selectedSlideId, {
                id, type: 'image',
                x: 150, y: 150, w: 400, h: 300, zIndex: 10,
                src: ev.target?.result as string
            });
            setTimeout(() => selectElement(id), 0);
        };
        reader.readAsDataURL(file);
        e.target.value = ''; // Reset
    };


    const handleFormat = (command: string, arg?: any) => {
        if (!editor) return;
        (editor.chain().focus() as any)[command](arg).run();
    };

    const togglePreview = () => {
        setPreviewMode(!isPreviewMode);
        if (!isPreviewMode) {
            // Request fullscreen
            document.documentElement.requestFullscreen().catch((e) => console.log(e));
        } else {
            document.exitFullscreen().catch(() => { });
        }
    };

    return (
        <div className="h-14 bg-obsidian border-b border-black flex items-center justify-between px-4 shrink-0 gap-4">
            {/* Left: Insert Tools */}
            <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                <button onClick={handleAddText} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all" title="Add Text">
                    <Type size={18} />
                </button>
                <label className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all cursor-pointer" title="Add Image">
                    <LucideImage size={18} />
                    <input id="toolbar-image-upload" type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
                </label>
            </div>

            {/* Center: Formatting (Active only if editor present) */}
            {editor ? (
                <div className="flex items-center gap-2">
                    {/* Font Family */}
                    <select
                        onChange={(e) => handleFormat('setFontFamily', e.target.value)}
                        value={editor.getAttributes('textStyle').fontFamily || 'Inter'}
                        className="bg-transparent text-white text-sm font-medium focus:outline-none w-32 bg-obsidian border border-transparent hover:border-white/20 rounded p-1"
                    >
                        <option value="Inter">Inter</option>
                        <option value="Arial">Arial</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Space Grotesk">Space Grotesk</option>
                        <option value="Courier New">Courier</option>
                    </select>

                    {/* Font Size */}
                    <div className="flex items-center gap-1 mx-2">
                        <select
                            onChange={(e) => handleFormat('setFontSize', e.target.value)}
                            value={editor.getAttributes('textStyle').fontSize || '16'}
                            className="bg-transparent text-white text-sm focus:outline-none w-14 bg-obsidian border border-transparent hover:border-white/20 rounded p-1"
                        >
                            {[12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72].map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>

                    {/* Color Picker using native input for now */}
                    <div className="flex items-center mx-1 relative group">
                        <div
                            className="w-5 h-5 rounded border border-white/20 cursor-pointer overflow-hidden"
                            style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }}
                        >
                            <input
                                type="color"
                                className="opacity-0 w-full h-full cursor-pointer p-0 border-0"
                                onChange={(e) => handleFormat('setColor', e.target.value)}
                                value={editor.getAttributes('textStyle').color || '#000000'}
                            />
                        </div>
                    </div>


                    <div className="w-px h-4 bg-white/10 mx-2" />

                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleFormat('toggleBold')}
                        className={`p-1.5 rounded transition-all ${editor.isActive('bold') ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Bold size={16} />
                    </button>
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleFormat('toggleItalic')}
                        className={`p-1.5 rounded transition-all ${editor.isActive('italic') ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Italic size={16} />
                    </button>
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleFormat('toggleUnderline')}
                        className={`p-1.5 rounded transition-all ${editor.isActive('underline') ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Underline size={16} />
                    </button>
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleFormat('toggleHighlight')}
                        className={`p-1.5 rounded transition-all ${editor.isActive('highlight') ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Highlighter size={16} />
                    </button>

                    <div className="w-px h-4 bg-white/10 mx-2" />

                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleFormat('setTextAlign', 'left')}
                        className={`p-1.5 rounded transition-all ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <AlignLeft size={16} />
                    </button>
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleFormat('setTextAlign', 'center')}
                        className={`p-1.5 rounded transition-all ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <AlignCenter size={16} />
                    </button>
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleFormat('toggleBulletList')}
                        className={`p-1.5 rounded transition-all ${editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <List size={16} />
                    </button>
                </div>
            ) : (
                <div className="text-sm text-gray-600 font-mono">Select an element to edit</div>
            )}

            {/* Right: Actions */}
            <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                <button
                    onClick={togglePreview}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-black hover:bg-gray-200 text-sm font-bold transition-colors shadow-lg"
                >
                    <Play size={14} fill="currentColor" /> Present
                </button>
            </div>
        </div>
    );
};
