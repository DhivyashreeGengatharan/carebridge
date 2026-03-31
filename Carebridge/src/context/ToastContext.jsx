import React, { createContext, useContext, useState } from 'react';

const ToastCtx = createContext(null);

function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  
  const show = (msg, type='success') => {
    setToast({msg, type});
    setTimeout(() => setToast(null), 2800);
  };
  
  const icons = { success:'✅', error:'❌', info:'ℹ️', warn:'⚠️' };
  
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {toast && (
        <div className="toast" style={{ background: toast.type==='error'?'#f4667a':toast.type==='warn'?'#f59e40':'#1a2744' }}>
          {icons[toast.type]} {toast.msg}
        </div>
      )}
    </ToastCtx.Provider>
  );
}

const useToast = () => useContext(ToastCtx);

export { ToastProvider, useToast };
