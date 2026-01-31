'use client';

import { TextElement } from '@/types';
import { RichTextEditor } from './RichTextEditor';

interface TextBlockProps {
    element: TextElement;
    slideId: string;
}

export const TextBlock = ({ element, slideId }: TextBlockProps) => {
    return (
        <div className="w-full h-full">
            <RichTextEditor
                content={element.html || '<ul><li>New point</li></ul>'}
                elementId={element.id}
                slideId={slideId}
            />
        </div>
    );
};
