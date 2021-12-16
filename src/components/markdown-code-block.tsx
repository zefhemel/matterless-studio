import React, {useCallback} from 'react';

import {CodeProps} from 'react-markdown/lib/ast-to-react';

import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism';

import Editor, {EditorState, useEditorState} from './editor';

type Props = React.PropsWithChildren<CodeProps> & {
    saveCodeBlock: (editorState: EditorState) => void;
}

export default function MarkdownCodeBlock(props: Props) {
    const {node, inline, className, children, ...passedProps} = props;
    const match = /language-(\w+)/.exec(className || '');

    const [editorState, setEditorState] = useEditorState();

    const saveEditor = useCallback((content: string) => {
        props.saveCodeBlock({
            ...editorState,
            content,
        });
        setEditorState(null);
    }, [editorState]);

    const cancelEditor = useCallback(() => {
        setEditorState(null);
    }, [editorState]);

    const onEditorTextChange = useCallback((content = '') => {
        setEditorState({content});
    }, []);

    const clickedCodeBlock = (content: string, language: string) => {
        setEditorState({
            content,
            contentSource: content,
            language,
        });
    };

    // Inline code block, or no language was provided. Render as vanilla code block.
    if (inline || !match) {
        return (
            <code
                className={className}
                style={{cursor: 'pointer'}}
                {...passedProps}
            >
                {children}
            </code>
        );
    }

    const language = match[1];

    // Not editing this code right now. Render as syntax-highlighted code block.
    if (!editorState.contentSource) {
        return (
            <div
                style={{cursor: 'pointer'}}
                onClick={(e) => {
                    clickedCodeBlock(String(children), language);
                }}
            >
                <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={dark}
                    language={language}
                    PreTag="div"
                    ref={passedProps.ref as any}
                    {...passedProps}
                />
            </div>
        );
    }

    // Render as Monaco editor
    return (
        <Editor
            save={saveEditor}
            cancel={cancelEditor}
            onTextChange={onEditorTextChange}
            {...editorState}
        />
    );
}
