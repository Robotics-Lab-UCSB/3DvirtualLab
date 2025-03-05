import React, { createContext, useContext, useState } from 'react';

// Define the type for the context value as an object
interface DnDContextType {
  type: string | null;
  setType: (type: string | null) => void;
}

// Create context with an undefined default value
const DnDContext = createContext<DnDContextType | undefined>(undefined);

// Provider component
export const DnDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [type, setType] = useState<string | null>(null);

  return (
    <DnDContext.Provider value={{ type, setType }}>
      {children}
    </DnDContext.Provider>
  );
};

// Hook to use the context
export const useDnD = (): DnDContextType => {
  const context = useContext(DnDContext);
  if (!context) {
    throw new Error('useDnD must be used within a DnDProvider');
  }
  return context;
};

export default DnDContext;
