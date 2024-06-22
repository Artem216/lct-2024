import { useToast } from '@/components/ui/use-toast';
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { IResponseImage } from '@/services/apiImage';
import ApiImage from '@/services/apiImage';


interface GeneratorImagesContextProps {
    isStartGeneration: boolean;
    setIsStartGeneration: React.Dispatch<React.SetStateAction<boolean>>;
    imgWidth: number;
    setImgWidth: React.Dispatch<React.SetStateAction<number>>;
    imgHeight: number;
    setImgHeight: React.Dispatch<React.SetStateAction<number>>;
    imgNumber: number;
    setImgNumber: React.Dispatch<React.SetStateAction<number>>;
    generatedImages: IResponseImage[];
    setGeneratedImages: React.Dispatch<React.SetStateAction<IResponseImage[]>>;
}

const GeneratorImagesContext = createContext<GeneratorImagesContextProps | undefined>(undefined);

const GeneratorImagesProvider = ({ children }: { children: ReactNode }) => {
    const [isStartGeneration, setIsStartGeneration] = useState(false);
    const [imgWidth, setImgWidth] = useState<number>(512);
    const [imgHeight, setImgHeight] = useState<number>(512);
    const [imgNumber, setImgNumber] = useState<number>(512);
    const [generatedImages, setGeneratedImages] = useState<IResponseImage[]>([]);

    const { toast } = useToast();


    useEffect(() => {
        let intervalId: number | NodeJS.Timeout;
    
        async function fetchImageStatus(ids: number[]) {
            try {
                const response = await ApiImage.getSeveralImagesByIds(ids);
                console.log(response, "response")
                setGeneratedImages((prevImages) => 
                    prevImages.map(image => {
                        const updatedImage = response.find(newImage => newImage.req_id === image.req_id);
                        return updatedImage ? { ...image, ...updatedImage } : image;
                    })
                );
    
                // Check if all images have status 'complete'
                const allComplete = response.every(image => image.status === 'complete');
                if (allComplete) {
                    clearInterval(intervalId as number);
                    setIsStartGeneration(false);
                }
            } catch (error) {
                toast({
                    title: "Ошибка генерации. Попробуйте снова",
                    variant: "destructive",
                });
            }
        }
    
        if (isStartGeneration && generatedImages.length > 0) {
            const imageIds: number[] = generatedImages.map(image => {return image.req_id});
            intervalId = setInterval(() => {
                fetchImageStatus(imageIds);
            }, 2000);
        }
    
        return () => {
            if (intervalId) {
                clearInterval(intervalId as number);
            }
        };
    }, [isStartGeneration]);
    




    return (
        <GeneratorImagesContext.Provider value={{
            isStartGeneration, setIsStartGeneration,
            imgHeight, imgWidth, setImgHeight, setImgWidth, imgNumber, setImgNumber, generatedImages, setGeneratedImages
        }}>
            {children}
        </GeneratorImagesContext.Provider>
    );
};

const useGeneratorImages = () => {
    const context = useContext(GeneratorImagesContext);
    if (!context) {
        throw new Error('useGeneratorImages must be used within a GeneratorImagesProvider');
    }
    return context;
};

export { GeneratorImagesProvider, useGeneratorImages };
