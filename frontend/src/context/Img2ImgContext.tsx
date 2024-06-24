import React, { createContext, useContext, ReactNode, useState, ChangeEvent } from 'react';

import { useToast } from '@/components/ui/use-toast';

interface Img2ImgContextProps {
    currentClust: string;
    setCurrentClust: React.Dispatch<React.SetStateAction<string>>;
    currentId: string;
    setCurrentId: React.Dispatch<React.SetStateAction<string>>;
    fileImg: File | null;
    setImgFile: React.Dispatch<React.SetStateAction<File | null>>;
    imgSrc: string | null;
    setImgSrc: React.Dispatch<React.SetStateAction<string | null>>;
    handleImgFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    // addFile: boolean;
    // setAddFile: React.Dispatch<React.SetStateAction<boolean>>;
}

const Img2ImgContext = createContext<Img2ImgContextProps | undefined>(undefined);

const Img2ImgProvider = ({ children }: { children: ReactNode }) => {
    const [currentClust, setCurrentClust] = useState<string>("");
    const [currentId, setCurrentId] = useState<string>("");
    const [fileImg, setImgFile] = useState<File | null>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    // const [addFile, setAddFile] = useState<boolean>(false);

    const { toast } = useToast();
    const handleImgFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        
        if (file && !allowedTypes.includes(file.type)) {
            return toast({
                title: "Загрузите изображение jpg/png",
                variant: "destructive",
            });
        }
        setImgFile(file);
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setImgSrc(fileUrl);
        }
    };
    

    return (
        <Img2ImgContext.Provider value={{
            currentClust,
            setCurrentClust,
            currentId,
            setCurrentId,
            fileImg,
            setImgFile,
            handleImgFileUpload,
            setImgSrc,
            imgSrc
            // addFile,
            // setAddFile
        }}>
            {children}
        </Img2ImgContext.Provider>
    );
};

const useImg2Img = () => {
    const context = useContext(Img2ImgContext);
    if (!context) {
        throw new Error('useImg2Img must be used within a Img2ImgProvider');
    }
    return context;
};

export { Img2ImgProvider, useImg2Img };
