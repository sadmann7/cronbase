import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type AppContextType = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  generatedData: string;
  setGeneratedData: Dispatch<SetStateAction<string>>;
};

const AppContext = createContext<AppContextType>({
  isLoading: false,
  setIsLoading: () => {},
  generatedData: "",
  setGeneratedData: () => {},
});
const useAppContext = () => useContext(AppContext);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState("");

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading,
        generatedData,
        setGeneratedData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, useAppContext };
