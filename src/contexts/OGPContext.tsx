import React, { createContext, useContext } from 'react';
import { Metadata } from '../utils/posts-type';

interface OGPContextType {
  metadata: Record<string, Metadata>;
}

const OGPContext = createContext<OGPContextType>({ metadata: {} });

export const useOGP = () => useContext(OGPContext);

interface OGPProviderProps {
  metadata: Record<string, Metadata>;
  children: React.ReactNode;
}

export const OGPProvider: React.FC<OGPProviderProps> = ({ metadata, children }) => {
  return (
    <OGPContext.Provider value={{ metadata }}>
      {children}
    </OGPContext.Provider>
  );
};