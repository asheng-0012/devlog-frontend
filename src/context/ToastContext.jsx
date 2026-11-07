import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null); // 1. create context

export function ToastProvider({ children }) { // 2. provider
  const [message, setMessage] = useState(null);

  const showToast = useCallback((text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div
          role="status"
          className="neu-raised fixed right-6 top-6 z-[100] rounded-2xl bg-surface px-6 py-4 text-lg"
        >
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext); // 3. useContext