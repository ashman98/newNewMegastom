import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Input } from "@material-tailwind/react"; // Подключаем стили

const TextEditor = ({contentText, setExternalContent}) => {
    const [content, setContent] = useState(''); // Состояние для хранения содержимого
    const quillRef = useRef(null); // Ссылка на редактор

    const handleChange = (value) => {
        setContent(value);
    };
    //
    useEffect(() => {
        setContent(contentText);
    }, [contentText]);

    useEffect(() => {
        setExternalContent(content);
    }, [content]);

    //
    // const updateContent = () => {
    //     const quill = quillRef.current.getEditor(); // Получаем экземпляр редактора
    //     const currentContent = quill.root.innerHTML; // Получаем текущее содержимое
    //
    //     // Обновляем первую строку, если она существует
    //     if (lines.length > 0) {
    //         lines[0] = `<h1 style="text-align: center; font-weight: bold;">${title}</h1>`; // Обновляем первую строку заголовком
    //     }
    //
    //     // Объединяем строки обратно в строку
    //     const newContent = lines.join('');
    //
    //     // Устанавливаем новое содержимое в редактор и состояние
    //     quill.root.innerHTML = newContent;
    //     setContent(newContent); // Обновляем содержимое в состоянии
    // };
    //
    // const handleKeyDown = (e) => {
    //     // Предотвращаем добавление нового <br> при нажатии Enter
    //     if (e.key === 'Enter') {
    //         e.preventDefault();
    //         const quill = quillRef.current.getEditor();
    //         const range = quill.getSelection();
    //         if (range) {
    //             quill.insertText(range.index, '\n'); // Вставляем новую строку без <br>
    //             quill.setSelection(range.index + 1); // Устанавливаем курсор на новую строку
    //         }
    //     }
    // };

    return (
        <div className="editor-container">
            <ReactQuill
                ref={quillRef}
                value={content}
                onChange={handleChange}
                modules={{
                    toolbar: [
                        [{'header': [1, 2, false]}],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{'list': 'ordered'}, {'list': 'bullet'}],
                        ['link', 'clean']
                    ]
                }}
                formats={[
                    'header', 'bold', 'italic', 'underline', 'strike',
                    'list', 'bullet', 'link', 'image', 'align'
                ]}
                theme="snow"
                className="react-quill"
            />
        </div>
    );
};

export default TextEditor;
