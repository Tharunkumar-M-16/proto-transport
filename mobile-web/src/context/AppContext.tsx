import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'user' | 'driver' | null;

interface AppContextType {
  role: Role;
  setRole: (r: Role) => void;
  name: string;
  setName: (n: string) => void;
  selectedArea: string;
  setSelectedArea: (a: string) => void;
  selectedBusId: string;
  setSelectedBusId: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [name, setName] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedBusId, setSelectedBusId] = useState('');

  return (
    <AppContext.Provider
      value={{
        role, setRole,
        name, setName,
        selectedArea, setSelectedArea,
        selectedBusId, setSelectedBusId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}