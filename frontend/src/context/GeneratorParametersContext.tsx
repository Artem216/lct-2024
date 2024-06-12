// GeneratorParametersContext.tsx

import { useToast } from '@/components/ui/use-toast';
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export interface GeneratorParametersState {
    channel: string;
    product: string;
    prompt: string;
    width: number;
    height: number;
    imageType: string;
    color: string;
    imageNumber: string;
}

const initialState: GeneratorParametersState = {
    channel: '',
    product: '',
    prompt: '',
    width: 0,
    height: 0,
    imageType: '',
    color: '',
    imageNumber: '',
};

interface GeneratorParametersContextProps {
    state: GeneratorParametersState;
    setState: React.Dispatch<React.SetStateAction<GeneratorParametersState>>;
    allChannels: string[];
    allProducts: string[];
    allImageTypes: string[];
    collectAndSend: () => void;
}

const GeneratorParametersContext = createContext<GeneratorParametersContextProps | undefined>(undefined);

const GeneratorParametersProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<GeneratorParametersState>(initialState);
    const [allChannels, setAllChannels] = useState<string[]>([]);
    const [allProducts, setAllProducts] = useState<string[]>([]);
    const [allImageTypes, setAllImageTypes] = useState<string[]>([]);
    const { toast } = useToast();


    useEffect(() => {
        setAllChannels([''])
        setAllProducts([''])
        setAllImageTypes([''])
    }, [])

    const collectAndSend = () => {
        // return toast({
        //     title: "Пустое поле",
        //     variant: "destructive",
        // })
        // Send the payload to the API
        const payload = { ...state }; // No need to include allChannels, allProducts, allImageTypes
        console.log(payload);
        // fetch('https://api.example.com/endpoint', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(payload),
        // })
        //   .then((response) => response.json())
        //   .then((data) => {
        //     console.log('Success:', data);
        //   })
        //   .catch((error) => {
        //     console.error('Error:', error);
        //   });
    };

    return (
        <GeneratorParametersContext.Provider value={{ state, setState, allChannels, allProducts, allImageTypes, collectAndSend }}>
            {children}
        </GeneratorParametersContext.Provider>
    );
};

const useGeneratorParameters = () => {
    const context = useContext(GeneratorParametersContext);
    if (!context) {
        throw new Error('useGeneratorParameters must be used within a GeneratorParametersProvider');
    }
    return context;
};

export { GeneratorParametersProvider, useGeneratorParameters };
