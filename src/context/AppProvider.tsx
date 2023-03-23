import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type AppContextType = {
  generatedData: string;
  setGeneratedData: Dispatch<SetStateAction<string>>;
  explainedData: string;
  setExplainedData: Dispatch<SetStateAction<string>>;
};

const AppContext = createContext<AppContextType>({
  generatedData: "",
  setGeneratedData: () => {},
  explainedData: "",
  setExplainedData: () => {},
});
const useAppContext = () => useContext(AppContext);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [generatedData, setGeneratedData] = useState("");
  const [explainedData, setExplainedData] = useState("");

  return (
    <AppContext.Provider
      value={{
        generatedData,
        setGeneratedData,
        explainedData,
        setExplainedData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, useAppContext };
