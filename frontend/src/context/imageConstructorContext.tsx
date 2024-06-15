import React, { createContext, useContext, ReactNode, useState } from 'react';


interface ImageConstructorContextProps {
    color: string;
    setColor: React.Dispatch<React.SetStateAction<string>>;
    text: string;
    setText: React.Dispatch<React.SetStateAction<string>>;
    width: number;
    setWidth: React.Dispatch<React.SetStateAction<number>>;
    height: number;
    setHeight: React.Dispatch<React.SetStateAction<number>>;
}


const ImageConstructorContext = createContext<ImageConstructorContextProps | undefined>(undefined);


const ImageConstructorProvider = ({ children }: { children: ReactNode }) => {
    const [color, setColor] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    return (
        <ImageConstructorContext.Provider
            value={{ color, setColor, text, setText, width, setWidth, height, setHeight }}
        >
            {children}
        </ImageConstructorContext.Provider>
    );
};


const useImageConstructor = () => {
    const context = useContext(ImageConstructorContext);
    if (!context) {
        throw new Error('useImageConstructor must be used within an ImageConstructorProvider');
    }
    return context;
};

export { ImageConstructorProvider, useImageConstructor };
