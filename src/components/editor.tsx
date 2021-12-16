import React, {useState} from 'react';

import MonacoEditor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

export type EditorState = {
    contentSource: string;
    content: string;
    language: string;
}

export type EditorProps = EditorState & {
    save: (content: string) => void;
    cancel: () => void;
    onTextChange: (content?: string) => void;
}

export default function Editor(props: EditorProps) {
    const style: React.CSSProperties = {
        border: 'solid 1px',
    };
    if (!props.contentSource) {
        style.display = 'none';
    }

    const buttonStyle = {
        cursor: 'pointer',
    };

    const buttons = (
        <div>
            <button onClick={() => props.save(props.content)} style={buttonStyle}>
                {'Save'}
            </button>
            <button onClick={props.cancel} style={buttonStyle}>
                {'Cancel'}
            </button>
        </div>
    );

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
        editor.focus();

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
            props.save(editor.getValue());
        });
    };

    const editorHeight = getEditorHeight(props.content);
    const monacoEditor = (
        <MonacoEditor
            height={editorHeight}
            theme={'vs-dark'}
            language={props.language}
            value={props.content}
            onChange={props.onTextChange}
            onMount={handleEditorDidMount}
            options={{
                scrollBeyondLastLine: false,
                padding: {
                    bottom: 200,
                },
                minimap: {
                    enabled: false
                },
            }}
        />
    );

    return (
        <div style={style}>
            {buttons}
            {monacoEditor}
        </div>
    );
}

export const useEditorState = (): [EditorState, (newState: Partial<EditorState> | null) => void] => {
    const initial = {
        content: '',
        contentSource: '',
        language: '',
    };

    const [state, setState] = useState(initial);

    return [state, (newState) => setState(previousState => {
        if (!newState) {
            return initial;
        }

        return {
            ...previousState,
            ...newState,
        }
    })];
};

const getEditorHeight = (content: string): string => {
    const LINE_HEIGHT = 18;
    const CONTAINER_GUTTER = 10;

    const minHeight = LINE_HEIGHT * 10 + CONTAINER_GUTTER;
    const maxHeight = LINE_HEIGHT * 45 + CONTAINER_GUTTER;

    const numLines = content.split('\n').length;
    const extraLines = 10;
    let editorHeight = (numLines + extraLines) * LINE_HEIGHT;

    editorHeight = Math.max(minHeight, editorHeight);
    editorHeight = Math.min(maxHeight, editorHeight);
    return editorHeight + 'px';
}
