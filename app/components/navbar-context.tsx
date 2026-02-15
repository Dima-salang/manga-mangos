"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

interface NavbarStateContextType {
  actions: React.ReactNode | null;
}

interface NavbarSetContextType {
  setActions: (actions: React.ReactNode | null) => void;
}

const NavbarStateContext = createContext<NavbarStateContextType | undefined>(undefined);
const NavbarSetContext = createContext<NavbarSetContextType | undefined>(undefined);

export function NavbarProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [navbarActions, setNavbarActions] = useState<React.ReactNode | null>(null);

  const setActions = useCallback((newActions: React.ReactNode | null) => {
    setNavbarActions(newActions);
  }, []);

  const stateValue = useMemo(() => ({ actions: navbarActions }), [navbarActions]);
  const setValue = useMemo(() => ({ setActions }), [setActions]);

  return (
    <NavbarSetContext.Provider value={setValue}>
      <NavbarStateContext.Provider value={stateValue}>
        {children}
      </NavbarStateContext.Provider>
    </NavbarSetContext.Provider>
  );
}

export function useNavbarActions(actions: React.ReactNode | null) {
  const setContext = useContext(NavbarSetContext);
  if (!setContext) {
    throw new Error('useNavbarActions must be used within a NavbarProvider');
  }

  useEffect(() => {
    setContext.setActions(actions);
    return () => setContext.setActions(null);
  }, [actions, setContext]);
}

export function NavbarActions() {
  const stateContext = useContext(NavbarStateContext);
  if (!stateContext) return null;
  return <>{stateContext.actions}</>;
}
