import React, { createContext, useContext, ReactNode, useState, ChangeEvent } from 'react';

interface FileUploaderContextProps {
    currentClust: string;
    setCurrentClust: React.Dispatch<React.SetStateAction<string>>;
    currentId: string;
    setCurrentId: React.Dispatch<React.SetStateAction<string>>;
    file: File | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    // addFile: boolean;
    // setAddFile: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileUploaderContext = createContext<FileUploaderContextProps | undefined>(undefined);

const FileUploaderProvider = ({ children }: { children: ReactNode }) => {
    const [currentClust, setCurrentClust] = useState<string>("");
    const [currentId, setCurrentId] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    // const [addFile, setAddFile] = useState<boolean>(false);

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFile(file);
    }

    return (
        <FileUploaderContext.Provider value={{
            currentClust,
            setCurrentClust,
            currentId,
            setCurrentId,
            file,
            setFile,
            handleFileUpload
            // addFile,
            // setAddFile
        }}>
            {children}
        </FileUploaderContext.Provider>
    );
};

const useFileUploader = () => {
    const context = useContext(FileUploaderContext);
    if (!context) {
        throw new Error('useFileUploader must be used within a FileUploaderProvider');
    }
    return context;
};

export { FileUploaderProvider, useFileUploader };
