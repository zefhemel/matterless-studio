import React, {useRef} from "react";

import Editor from "@monaco-editor/react";
import monaco from "monaco-editor";

function App() {
    const editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null> = useRef(null);

    function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
        editorRef.current = editor;
    }

    function showValue() {
        if (editorRef.current !== null) {
            alert(editorRef.current.getValue());
        }
    }

    return (
        <>
            <button onClick={showValue}>Show value</button>
            <Editor
                height="90vh"
                defaultLanguage="markdown"
                defaultValue="# Some header"
                options={{
                    minimap: {
                        enabled: false
                    },
                }}
                onMount={handleEditorDidMount}
            />
        </>
    );
}


export default App;
