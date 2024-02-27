import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
const FileUpload = ({ handleUploadedFiles }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setUploadedFiles(acceptedFiles);
            handleUploadedFiles(acceptedFiles);
        },
    });
    return (
        <div {...getRootProps()} style={{ border: '3px dashed black', margin: '20px', padding: '20px' }}>
            <input {...getInputProps()} />
            <p>Drag and drop files here or click to browse.</p>
            <ul>
                {uploadedFiles.map((file) => (
                    <li key={file.name}>{file.name}</li>
                ))}
            </ul>
        </div>
    );
};
export default FileUpload;