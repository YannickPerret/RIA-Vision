import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLanguage } from '../providers/languages';
const FileUpload = ({ handleUploadedFiles }) => {


    const { translations } = useLanguage();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            setUploadedFiles(acceptedFiles);
            handleUploadedFiles(acceptedFiles);
        },
    });
    console.log('translations: ', translations);

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