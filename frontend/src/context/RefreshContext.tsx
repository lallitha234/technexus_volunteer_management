import React, { createContext, useContext, useCallback, useState } from 'react';

interface RefreshContextType {
  refreshDashboard: () => void;
  triggerRefresh: () => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshCount, setRefreshCount] = useState(0);

  const refreshDashboard = useCallback(() => {
    setRefreshCount((prev) => prev + 1);
  }, []);

  const triggerRefresh = useCallback(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  return (
    <RefreshContext.Provider value={{ refreshDashboard, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefresh must be used within RefreshProvider');
  }
  return context;
};
