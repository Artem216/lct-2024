import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import ApiImage from '@/services/apiImage';
import { IResponseCard, IResponseCardFull } from '@/services/apiImage';

interface AllImagesContextProps {
    topNCards: IResponseCard[];
    setTopNCards: React.Dispatch<React.SetStateAction<IResponseCard[]>>;
    topAllCards: IResponseCard[];
    setTopAllCards: React.Dispatch<React.SetStateAction<IResponseCard[]>>;
    myCards: IResponseCardFull[];
    setMyCards: React.Dispatch<React.SetStateAction<IResponseCardFull[]>>;
}

const AllImagesContext = createContext<AllImagesContextProps | undefined>(undefined);

const AllImagesProvider = ({ children }: { children: ReactNode }) => {
    const [topNCards, setTopNCards] = useState<IResponseCard[]>([]);
    const [topAllCards, setTopAllCards] = useState<IResponseCard[]>([]);
    const [myCards, setMyCards] = useState<IResponseCardFull[]>([]);

    useEffect(() => {
        async function fetchTopNCards(topN: number) {
            try {
                const response = await ApiImage.getTopCards(topN)
                console.log(response)
                setTopNCards(response);
            } catch (error) {
                console.log(error);
            }
        }

        async function fetchTopAllCards(topN: number) {
            try {
                const response = await ApiImage.getTopCards(topN);
                console.log(response)
                setTopAllCards(response);
            } catch (error) {
                console.log(error);

            }
        }

        async function fetchMyCards() {
            try {
                const response = await ApiImage.getAllUserCards();
                console.log(response)
                setMyCards(response);
            } catch (error) {
                console.log(error);
            }
        }

        fetchTopNCards(3); 
        fetchTopAllCards(10000);
        fetchMyCards();
    }, []);

    return (
        <AllImagesContext.Provider
            value={{ topNCards, setTopNCards, topAllCards, setTopAllCards, myCards, setMyCards }}
        >
            {children}
        </AllImagesContext.Provider>
    );
};

const useAllImages = () => {
    const context = useContext(AllImagesContext);
    if (!context) {
        throw new Error('useAllImages must be used within an AllImagesProvider');
    }
    return context;
};

export { AllImagesProvider, useAllImages };
