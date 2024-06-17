import { createContext, useContext } from "react";
import { toast } from "react-toastify";

const ToastContext = createContext("");

export const useToast = () => {
  return useContext(ToastContext);
};

export default function ToastContextProvider({ children }) {
  const toastValue = (type, message) => {
    return toast[type](message,{
      autoClose: 1000
    });
  };

  return (
    <ToastContext.Provider value={{ toastValue }}>
      {children}
    </ToastContext.Provider>
  );
}
