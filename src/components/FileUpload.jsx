import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
const FileUpload = ({ handleUploadedFiles }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || navigator.language.slice(0, 2));
    const [translations, setTranslations] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            setUploadedFiles(acceptedFiles);
            handleUploadedFiles(acceptedFiles);
        },
    });
    useEffect(() => {
        fetch('langages/langages.json')
            .then(response => response.json())
            .then(data => {
                if (!data[language]) {
                    setLanguage('en');
                }
                setTranslations(data[language]);
                localStorage.setItem('language', language);
            });
    }, [language]);
    return (
        <div {...getRootProps()} style={{ border: '3px dashed black', margin: '20px', padding: '20px' }}>
            <input {...getInputProps()} />
            <p>{translations.labelFileUpload}</p>
            <ul>
                {uploadedFiles.map((file) => (
                    <li key={file.name}>{file.name}</li>
                ))}
            </ul>
        </div>
    );
};
export default FileUpload;