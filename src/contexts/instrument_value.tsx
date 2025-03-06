import React, { createContext, useContext, useState } from "react";

type InstrumentDictionary = Record<string, Record<string, any>>;

interface InstrumentContextType {
  instruments: InstrumentDictionary;
  registerInstrument: (idx: string, value: Record<string, any>) => void;
  updateInstrument: (idx: string, key: string, value: any) => void;
  deleteInstrument: (idx: string) => void;
  readInstrument: (idx: string, key: string) => any | undefined;
  updateInstrumentSafe: (idx: string, key: string, value: any) => void;
}

const InstrumentContext = createContext<InstrumentContextType | undefined>(
  undefined
);

export const InstrumentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [instruments, setInstruments] = useState<InstrumentDictionary>({});

  const registerInstrument = (idx: string, value: Record<string, any>) => {
    setInstruments((prev) => ({ ...prev, [idx]: value }));
  };

  const updateInstrument = (idx: string, key: string, value: any) => {
    setInstruments((prev) => {
      if (!prev[idx]) return prev; // If instrument doesn't exist, do nothing
      return { ...prev, [idx]: { ...prev[idx], [key]: value } };
    });
  };

  const updateInstrumentSafe = (id: string, key: string, value: any) => {
    if (instruments[id]?.[key] !== value) { // ✅ Only update if different
      console.log(`✅ Updating ${id} → ${key} = ${value}`);
      updateInstrument(id, key, value);
    } else {
      console.log(`❌ Skipping redundant update for ${id} → ${key}`);
    }
  };
  

  const deleteInstrument = (idx: string) => {
    setInstruments((prev) => {
      const newInstruments = { ...prev };
      delete newInstruments[idx];
      return newInstruments;
    });
  };

  const readInstrument = (idx: string, key: string) => {
    return instruments[idx]?.[key]; // Returns the value if it exists, otherwise undefined
  };

  return (
    <InstrumentContext.Provider
      value={{ instruments, registerInstrument, updateInstrumentSafe, updateInstrument, deleteInstrument, readInstrument }}
    >
      {children}
    </InstrumentContext.Provider>
  );
};

export const useInstruments = (): InstrumentContextType => {
  const context = useContext(InstrumentContext);
  if (!context) {
    throw new Error("useInstruments must be used within an InstrumentProvider");
  }
  return context;
};
