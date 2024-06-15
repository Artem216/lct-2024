import React, { createContext, useContext, ReactNode, useState } from 'react';


interface ImageConstructorContextProps {
    color: string;
    setColor: React.Dispatch<React.SetStateAction<string>>;
    colorText: string;
    setColorText: React.Dispatch<React.SetStateAction<string>>;
    text: string;
    setText: React.Dispatch<React.SetStateAction<string>>;
    width: number;
    setWidth: React.Dispatch<React.SetStateAction<number>>;
    height: number;
    setHeight: React.Dispatch<React.SetStateAction<number>>;
    fontSize: number;
    setFontSize: React.Dispatch<React.SetStateAction<number>>;
    undo: boolean;
    setUndo: React.Dispatch<React.SetStateAction<boolean>>;
}


const ImageConstructorContext = createContext<ImageConstructorContextProps | undefined>(undefined);


const ImageConstructorProvider = ({ children }: { children: ReactNode }) => {
    const [color, setColor] = useState<string>('');
    const [colorText, setColorText] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [fontSize, setFontSize] = useState<number>(50);
    const [undo, setUndo] = useState<boolean>(false);

    return (
        <ImageConstructorContext.Provider
            value={{ color, setColor, text, setText, width, setWidth, height, setHeight,
                fontSize, setFontSize, colorText, setColorText, undo, setUndo
             }}
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
