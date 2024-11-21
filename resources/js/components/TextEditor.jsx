import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Input } from "@material-tailwind/react";
import DOMPurify from 'dompurify'; // Import DOMPurify for sanitization

const TextEditor = ({ contentText, setExternalContent, readOnly }) => {
    const [content, setContent] = useState('');
    const quillRef = useRef(null);

    useEffect(() => {
        // Sanitize the content from the database before setting it
        const sanitizedContent = DOMPurify.sanitize(contentText);

        setContent(sanitizedContent);
    }, [contentText]);

    useEffect(() => {
        setExternalContent(content);
    }, [content]);

    const handleChange = (value) => {
        const textOnlyContent = value.replace(/<[^>]*>/g, '').trim();

        // Check if the stripped content has at least one letter or number
        if (!/[a-zA-Z0-9]/.test(textOnlyContent)) {
            setContent(''); // Clear content if there's no meaningful text
        }

        setContent(value);
    };

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'link', 'image', 'align'
    ];

    const toolbar = readOnly ? false : [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'clean']
    ];

    return (
        <div className="editor-container">
            <ReactQuill
                ref={quillRef}
                value={content}
                onChange={handleChange}
                readOnly={readOnly}
                modules={{
                    toolbar: toolbar
                }}
                formats={formats}
                theme="snow"
                className={`react-quill `}
            />
        </div>
    );
};

export default TextEditor;
