import React, {useState, useEffect} from 'react';

import {EditorState} from './components/editor';
import ReactMarkdown from 'react-markdown';
import MarkdownCodeBlock from './components/markdown-code-block';

function App() {
    const [markdownContent, setMarkdownContent] = useState('');

    useEffect(() => {
        const {publicFilesURL} = window as any;
        const testDataURL = `${publicFilesURL}/testdata/initial-markdown-content.md`;

        fetch(testDataURL)
            .then(r => r.text())
            .then(setMarkdownContent);
    }, []);

    const saveCodeBlock = (editorState: EditorState) => {
        const begin = markdownContent.indexOf(editorState.contentSource);
        const end = begin + editorState.contentSource.length;

        const newMarkdownContent = markdownContent.substring(0, begin) + editorState.content + markdownContent.substring(end);
        setMarkdownContent(newMarkdownContent);
    }

    const markdown = (
        <ReactMarkdown
            children={markdownContent}
            components={{
                code: (codeProps) => (
                    <MarkdownCodeBlock
                        saveCodeBlock={saveCodeBlock}
                        {...codeProps}
                    />
                )
            }}
        />
    );

    const pageStyle: React.CSSProperties = {
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingBottom: '100px',
        width: '60%',
        margin: '0 auto',
    }

    return (
        <div style={pageStyle}>
            {markdown}
        </div>
    );
}


export default App;
