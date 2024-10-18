/* eslint-disable @typescript-eslint/no-empty-function */
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

interface MessageContextType {
  message: { text: string; type: "error" | "info" } | null;
  setMessage: React.Dispatch<
    React.SetStateAction<{ text: string; type: "error" | "info" } | null>
  >;
}

const defaultValue: MessageContextType = {
  message: null,
  setMessage: () => {},
};

const MessageContext = createContext<MessageContextType>(defaultValue);

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({
  children,
}) => {
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "info";
  } | null>(null);

  useEffect(() => {
    // Function to clear message
    const clearMessage = () => setMessage(null);

    // Clear message when pathname changes
    clearMessage();

    // We setup this effect to run only when pathname changes
  }, []); // Dependency on router.pathname

  const value = { message, setMessage };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
