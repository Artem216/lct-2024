// GeneratorParametersContext.tsx

import React, { createContext, useContext, ReactNode, useState } from 'react';

interface GeneratorParametersState {
  channel: string;
  allChannels: string[];
  product: string;
  allProducts: string[];
  prompt: string;
  width: number;
  height: number;
  imageType: string;
  allImageTypes: string[];
  color: string;
  imageNumber: string;
}

const initialState: GeneratorParametersState = {
  channel: '',
  allChannels: [],
  product: '',
  allProducts: [],
  prompt: '',
  width: 0,
  height: 0,
  imageType: '',
  allImageTypes: [],
  color: '',
  imageNumber: '',
};

interface GeneratorParametersContextProps {
  state: GeneratorParametersState;
  setState: React.Dispatch<React.SetStateAction<GeneratorParametersState>>;
  collectAndSend: () => void;
}

const GeneratorParametersContext = createContext<GeneratorParametersContextProps | undefined>(undefined);

const GeneratorParametersProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GeneratorParametersState>(initialState);

  const collectAndSend = () => {
    // Send the payload to the API
    fetch('https://api.example.com/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <GeneratorParametersContext.Provider value={{ state, setState, collectAndSend }}>
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
