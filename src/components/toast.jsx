import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const notify = (message, tone = 'success') => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3200);
  };

  return (
    <ToastContext.Provider value={notify}>
      {children}
      {toast && <div className={`toast toast-${toast.tone}`} role="status">{toast.message}</div>}
    </ToastContext.Provider>
  );
}
