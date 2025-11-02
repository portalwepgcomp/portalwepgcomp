"use client";

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import {
  getUserLocalStorage,
  LoginRequest,
  setTokenLocalStorage,
  setUserLocalStorage,
  validateToken,
} from "./util";
import api from "../../utils/api";

export const AuthContext = createContext<IContextLogin>({} as IContextLogin);

interface IContextLogin {
  user: UserProfile | null;
  signed: boolean;
  singIn: (body: UserLogin) => Promise<void>;
  logout: () => void;
  isValidatingToken: boolean;
  isLoggingOut: boolean;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<null | UserProfile>(null);
  const [isValidatingToken, setIsValidatingToken] = useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { showAlert } = useSweetAlert();
  const router = useRouter();

  useEffect(() => {
    const checkTokenValidity = async () => {
      const userSigned = getUserLocalStorage();
      
      if (userSigned) {
        const isValid = await validateToken();
        
        if (isValid) {
          setUser(JSON.parse(userSigned));
        } else {
          // Token expirado ou inválido
          localStorage.clear();
          setUser(null);
          
          showAlert({
            icon: "warning",
            title: "Sessão Expirada",
            text: "Sua sessão expirou. Por favor, faça login novamente.",
            confirmButtonText: "Ok",
          });
          
          router.push("/login");
        }
      }
      
      setIsValidatingToken(false);
    };

    checkTokenValidity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listener para sessão expirada durante navegação
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      
      showAlert({
        icon: "warning",
        title: "Sessão Expirada",
        text: "Sua sessão expirou. Por favor, faça login novamente.",
        confirmButtonText: "Ok",
      });
      
      router.push("/login");
    };

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const singIn = async ({ email, password }) => {
    try {
      const response = await LoginRequest(email, password);
      const payload = {
        token: response.token,
        data: response.data,
      };

      setUser(payload.data);
      api.defaults.headers.common["Authorization"] = `Bearer ${payload.token}`;
      setTokenLocalStorage(payload.token);
      setUserLocalStorage(payload.data);
    } catch (err: any) {
      setUser(null);

      showAlert({
        icon: "error",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });
    }
  };

  function logout() {
    setIsLoggingOut(true);
    router.push("/home");
    localStorage.clear();
    setUser(null);
    setTimeout(() => setIsLoggingOut(false), 500);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signed: !!user,
        singIn,
        logout,
        isValidatingToken,
        isLoggingOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
