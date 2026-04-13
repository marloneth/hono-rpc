import { createContext, useCallback, useContext, useState } from "react";

interface ErrorContextValue {
  error: string | null;
  showError: (message: string) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextValue | null>(null);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  const showError = useCallback((message: string) => setError(message), []);
  const clearError = useCallback(() => setError(null), []);

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const ctx = useContext(ErrorContext);
  if (!ctx) throw new Error("useError must be used within ErrorProvider");
  return ctx;
}
