import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface ActiveEditionProps {
  children: ReactNode;
}

interface ActiveEditionProviderData {
  selectEdition: {
    year: string;
    isActive: boolean;
  };
  setSelectEdition: Dispatch<
    SetStateAction<{
      year: string;
      isActive: boolean;
    }>
  >;
  loadingActiveEdition: boolean;
  setLoadingActiveEdition: Dispatch<SetStateAction<boolean>>;
}

export const ActiveEditionContext = createContext<ActiveEditionProviderData>(
  {} as ActiveEditionProviderData
);

export const ActiveEditionProvider = ({ children }: ActiveEditionProps) => {
  const [selectEdition, setSelectEdition] = useState<{
    year: string;
    isActive: boolean;
  }>({ year: "", isActive: false });

  const [loadingActiveEdition, setLoadingActiveEdition] =
    useState<boolean>(false);

  useEffect(() => {
    const savedEdition = localStorage.getItem("activeEdition");
    if (savedEdition) {
      setSelectEdition(JSON.parse(savedEdition));
    }
  }, []);

  useEffect(() => {
    if (selectEdition.year) {
      localStorage.setItem("activeEdition", JSON.stringify(selectEdition));
    }
  }, [selectEdition]);

  return (
    <ActiveEditionContext.Provider
      value={{
        selectEdition,
        setSelectEdition,
        loadingActiveEdition,
        setLoadingActiveEdition,
      }}
    >
      {children}
    </ActiveEditionContext.Provider>
  );
};
