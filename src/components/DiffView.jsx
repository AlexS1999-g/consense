import React from 'react';
import * as Diff from 'diff';

const DiffView = ({ oldText, newText }) => {
    if (!oldText || !newText) return <span>{newText}</span>;

    // Compare words to make it readable
    const diff = Diff.diffWords(oldText, newText);

    return (
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontFamily: 'monospace', fontSize: '0.9rem' }}>
            {diff.map((part, index) => {
                // Green for additions, Red/Strikethrough for deletions
                const color = part.added ? '#4ade80' : part.removed ? '#ef4444' : 'inherit';
                const textDecoration = part.removed ? 'line-through' : 'none';
                const background = part.added ? 'rgba(74, 222, 128, 0.1)' : part.removed ? 'rgba(239, 68, 68, 0.1)' : 'transparent';
                const opacity = part.removed ? 0.6 : 1;

                return (
                    <span
                        key={index}
                        style={{
                            color, textDecoration, background, opacity,
                            padding: (part.added || part.removed) ? '0 2px' : '0',
                            borderRadius: '2px'
                        }}
                    >
                        {part.value}
                    </span>
                );
            })}
        </div>
    );
};

export default DiffView;
